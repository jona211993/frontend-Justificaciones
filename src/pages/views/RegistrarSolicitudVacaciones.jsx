import  { useState, useEffect } from 'react';
import { Calendar, Modal, message } from 'antd';
import { DatePicker, Form, Input, Button } from 'antd';
import { useAuth } from "../../contexts/AuthContext.jsx";
import axios from 'axios';
import '../../styles/calendario.css'; // Asegúrate de importar el archivo CSS con las clases personalizadas
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};

export const RegistrarSolicitudVacaciones = () => {
  const [blockedRanges, setBlockedRanges] = useState([]);
  const { user } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const idArea = user.user.idArea;
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/obtenerDiasOcupados/${idArea}`);
        const data = await response.json();
        const ranges = data.data.map(item => ({
          start: dayjs(item.fecInicial).add(1, 'day'),
          end: dayjs(item.fecFinal).add(1, 'day'), // Sumar un día al final del rango
        }));

          // Calcular los próximos 6 días (incluyendo hoy) como fechas bloqueadas
          const today = dayjs();
          console.log("hoy es : ",today)
          const nextSevenDays = Array.from({ length: 7}, (_, i) => ({
            start: today.add(i, 'day'),
            end: today.add(i, 'day'),
          }));
  
          setBlockedRanges([...ranges, ...nextSevenDays]);
      } catch (error) {
        console.error('Error fetching blocked dates:', error);
      }
    };

    fetchBlockedDates();
  }, [user.user.idArea]);

  const disabledDate = (current) => {
    return blockedRanges.some(range => 
      current.isSameOrAfter(range.start, 'day') && current.isSameOrBefore(range.end, 'day')
    );
  };

  const dateCellRender = (current) => {
    const isBlocked = blockedRanges.some(range =>
      current.isSameOrAfter(range.start, 'day') && current.isSameOrBefore(range.end, 'day')
    );
    return (
      <div className={isBlocked ? 'bg-red-500 text-red-500 rounded-3xl' : 'text-white'}>
        {current.date()}
      </div>
    );
  };

  const handleFinish = async (values) => {
    const datosFinales = {
      ...values,
      idArea: user.user.idArea,
      idJefe: user.user.idJefe,
      idEmpleado: user.user.idEmpleado,
      usrInsert: user.user.usuario 
    };
    console.log('Valores del formulario:', datosFinales);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/registrarSolicitudVacaciones`, datosFinales);
      if (response.status === 200) {
        message.success('Solicitud enviada correctamente');
        Modal.success({
          content: 'Solicitud enviada correctamente',
          onOk: () => setTimeout(() => Modal.destroyAll(), 2000)
        });
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      message.error('Error al enviar la solicitud');
    }
  };

  return (
    <div className="h-screen overflow-scroll flex flex-col items-center gap-5">
      <h1 className="mt-15 text-3xl font-bold font-roboto">Formulario Solicitud</h1>
      <div className="flex gap-5 justify-center">
        <div className="w-2/5 rounded-lg shadow-lg p-4 flex items-center">
          <Calendar
            className="custom-calendar"
            disabledDate={disabledDate}
            cellRender={dateCellRender}
          />
        </div>
        <div className="pt-5">
          <Form
            {...formItemLayout}
            form={form}
            variant="filled"
            style={{
              minWidth: 500,
              maxWidth: 650,
            }}
            onFinish={handleFinish}
          >
            <Form.Item
              label="Elija los días"
              name="diasElejidos"
              rules={[
                {
                  required: true,
                  message: 'Por favor este campo es requerido!',
                },
              ]}
            >
              <RangePicker disabledDate={disabledDate} />
            </Form.Item>

            <Form.Item
              label="Detalle"
              name="detalle"
              rules={[
                {
                  required: true,
                  message: 'Por favor este campo es requerido!',
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 6,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Enviar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
