import { Menu } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import {
  HomeOutlined,
  TeamOutlined,
  AuditOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { SubMenu, Item } = Menu;

export const MenuList = () => {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/login";
    // Recarga la página después de navegar a la página de inicio de sesión
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center">
   
    <Menu
      theme="dark"
      mode="inline"
      className="h-screen mt-8 flex flex-col gap-4 text-sm relative"
      defaultSelectedKeys={["home"]}
    >
      
      <Item key="home" icon={<HomeOutlined />}>
        <Link to="/expertisRH">HOME</Link>
      </Item>
      {user.user.id_cargo == 1 && (
        <Item key="empleados" icon={<TeamOutlined />}>
          <Link to="/expertisRH/empleados">EMPLEADOS</Link>
        </Item>
      )}
      <SubMenu
        key="justificaciones"
        icon={<AuditOutlined />}
        title="JUSTIFICACIONES"
      >
        {(user.user.id_cargo === 5 ||
          user.user.id_cargo === 7 ||
          user.user.id_cargo === 8) && (
          <Item key="crearJust">
            <Link to="/expertisRH/crearJust">Nueva Justificacion</Link>
          </Item>
        )}

        <Item key="listarJust">
          <Link to="/expertisRH/justificaciones">Listar Justificaciones</Link>
        </Item>
      </SubMenu>
      {user.user.id_cargo == 1 && (
        <Item key="vacaciones" icon={<CalendarOutlined />}>
          VACACIONES
        </Item>
      )}
      <Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Cerrar Sesion
      </Item>
    </Menu>
    </div>
  );
};
