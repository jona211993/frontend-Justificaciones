import { Layout } from "antd";
import { Logo } from "../components/sidebar/Logo";
import { MenuList } from "../components/sidebar/MenuList";
import { ContentView } from "../components/Contenido/ContentView";
import { useAuth } from "../contexts/AuthContext";

const { Header, Sider } = Layout;

function InicioPage() {
 
  const { user } = useAuth();
  return (
    
    <Layout>
      <Sider
         collapsible
        className="text-white"
        trigger={null}
        width={250}
      >
        <Logo></Logo>
        <h1 className="p-4 text-lg text-center">{user.user.usuario}</h1>
        <MenuList />
      </Sider>
      <Layout>
        <Header className="p-0 bg-gray-100 ">                   
        </Header>
        <ContentView />
      </Layout>
    </Layout>
  );
}

export default InicioPage;
