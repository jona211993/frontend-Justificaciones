import { useState } from "react";
import { Layout, Button } from "antd";
import { Logo } from "../components/sidebar/Logo";
import { MenuList } from "../components/sidebar/MenuList";
import { RightCircleOutlined , LeftCircleOutlined} from "@ant-design/icons";
import { ContentView } from "../components/Contenido/ContentView";

const { Header, Sider } = Layout;

function InicioPage() {
  const [colapsado, setColapsado] = useState(false);

  return (
    <Layout>
      <Sider
        collapsed={colapsado}
        collapsible
        className="text-white"
        trigger={null}
      >
        <Logo></Logo>
        <MenuList />
      </Sider>
      <Layout>
        <Header className="p-0 bg-gray-100">
          <Button
            style={{width: '40px' , height: '40px'}}
            type="text"
            onClick={() => {
              setColapsado(!colapsado);
            }}
            icon={colapsado ? <RightCircleOutlined /> : <LeftCircleOutlined />}
          />
        </Header>
        <ContentView />
      </Layout>
    </Layout>
  );
}

export default InicioPage;
