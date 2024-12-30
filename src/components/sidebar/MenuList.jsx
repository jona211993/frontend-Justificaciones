import { Menu } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import {
  HomeOutlined,
  TeamOutlined,
  AuditOutlined,
  CalendarOutlined,
  LogoutOutlined,
  WarningOutlined
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
        className="h-screen mt-0 flex flex-col gap-1 text-xs relative"
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
         {user.user.id_cargo == 1 && (
          <Item key="empleadosAlertaVacaciones" icon={<WarningOutlined />}>
            <Link to="/expertisRH/empleadosAlertaVacaciones">ALERTA VACACIONES</Link>
          </Item>          
        )}
        {user.user.id_cargo != 9 &&
          (user.user.id_cargo === 5 ||
            user.user.id_cargo === 7 ||
            user.user.id_cargo === 8 ||
            user.user.id_cargo === 1 ||
            user.user.id_cargo === 3 ||
            user.user.id_cargo === 4) && (
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
                <Link to="/expertisRH/justificaciones">
                  Listar Justificaciones
                </Link>
              </Item>
            </SubMenu>
          )}

        {user.user.id_cargo !== 6 && (
          <SubMenu
            key="vacaciones"
            icon={<CalendarOutlined />}
            title="VACACIONES"
          >
            {user.user.id_cargo != 9 && (
              <Item key="crearSolicitud">
                <Link to="/expertisRH/crearSolicitudVacaciones">
                  Enviar Solicitud
                </Link>
              </Item>
            )}
            {user.user.id_cargo != 9 && (
              <Item key="listarMisSolicitudes">
                <Link to="/expertisRH/listarSolicitudes">Mis Solicitudes</Link>
              </Item>
            )}
            {/*MODULO PARA SUPERVISOR*/}
            {user.user.id_cargo === 5 && (
              <Item key="registroVacacionesAsesor">
                <Link to="/expertisRH/registrarVacacionesAsesor">
                  Registrar Vacaciones Asesor
                </Link>
              </Item>
            )}
             {/*MODULO PARA SUPERVISOR*/}
            {user.user.id_cargo === 5 && (
              <Item key="ListarSolicitudesAsesores">
                <Link to="/expertisRH/listarSolicitudesAsesores">
                  Solicitudes Asesores
                </Link>
              </Item>
            )}

            {((user.user.idEmpleado === user.user.idJefe &&
              user.user.id_cargo != 9) ||
              user.user.idEmpleado == 214) && (
              <Item key="solicitudesDelEquipo">
                <Link to="/expertisRH/solicitudesEquipo">
                  Soicitudes Equipo
                </Link>
              </Item>
            )}
            {(user.user.id_cargo === 9 || user.user.idEmpleado === 179) && (
              <Item key="solicitudesAprobadasGerencia">
                <Link to="/expertisRH/solicitudesAprobadasGerencia">
                  Solicitudes Aprobadas
                </Link>
              </Item>
            )}
            {user.user.id_cargo === 9 && (
              <Item key="solicitudesPendientes">
                <Link to="/expertisRH/solicitudesEnProcesoGerencia">
                  Soicitudes Pendientes
                </Link>
              </Item>
            )}
            {user.user.id_cargo === 9 && (
              <Item key="Calendario Jefes">
                <Link to="/expertisRH/Calendario">Calendario Jefes Area</Link>
              </Item>
            )}
          </SubMenu>
        )}

        <Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
          Cerrar Sesion
        </Item>
      </Menu>
    </div>
  );
};
