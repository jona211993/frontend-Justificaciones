import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  TeamOutlined,
  AuditOutlined,
  CalendarOutlined
} from "@ant-design/icons";

const { SubMenu, Item } = Menu;

export const MenuList = () => {

  return (
    <Menu theme='dark' mode='inline' className='h-screen mt-8 flex flex-col gap-4 text-sm relative'>
      <Item key="home" icon={<HomeOutlined/>}>
      <Link to="/inicio">HOME</Link>
      </Item>
      <Item key="empleados" icon={<TeamOutlined/>}>
        <Link to="/inicio/empleados">EMPLEADOS</Link>
      </Item>
      <SubMenu key="justificaciones" icon={<AuditOutlined/>} title = "JUSTIFICACIONES">
        <Item key="crearJust">
          <Link to="/inicio/crearJust">Nueva Justificacion</Link>
        </Item>
        <Item key="listarJust">
        <Link to="/inicio/justificaciones">Listar Justificaciones</Link>
        </Item>
      </SubMenu>
      <Item key="vacaciones" icon={<CalendarOutlined/>}>
        VACACIONES
      </Item>
    </Menu>
  );
}
