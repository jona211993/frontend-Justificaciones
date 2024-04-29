import { useState } from "react";
import { Layout, Button } from "antd";
import { Logo } from "../components/sidebar/Logo";
import { MenuList } from "../components/sidebar/MenuList";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
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
        <Header style={{ padding: 0, background: "white" }}>
          <Button
            type="text"
            onClick={() => {
              setColapsado(!colapsado);
            }}
            icon={colapsado ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        </Header>
        <ContentView />
      </Layout>
    </Layout>
  );
}

export default InicioPage;
