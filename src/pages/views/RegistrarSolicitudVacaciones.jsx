import React from 'react';
import { Calendar } from 'antd';
import { DatePicker, Form, Input, Button } from 'antd';
import '../../styles/calendario.css'; // Asegúrate de importar el archivo CSS con las clases personalizadas

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
  return (
    <div className="bg-gray-400 h-screen overflow-scroll flex flex-col items-center gap-9">
      <h1 className="mt-15 text-3xl">Formulario Solicitud</h1>
      <div className="bg-cyan-400 flex gap-5 justify-center">
        <div className="w-2/5  bg-green-400 rounded-lg shadow-lg p-4 flex items-center ">
          <Calendar className="custom-calendar" />
        </div>
        <div className="bg-yellow-300 pt-5">
          <Form
            {...formItemLayout}
            variant="filled"
            style={{
              maxWidth: 600,
            }}
          >
            
         
            <Form.Item
              label="Elija los días"
              name="dias elejidos"
              rules={[
                {
                  required: true,
                  message: "Please input!",
                },
              ]}
            >
              <RangePicker />
            </Form.Item>

            <Form.Item
              label="Detalle"
              name="Detalle"
              rules={[
                {
                  required: true,
                  message: "Please input!",
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
