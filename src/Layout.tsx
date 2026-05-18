import { Outlet, useNavigate } from "react-router-dom";
import {
    AppOutline,
    MessageOutline,
    MessageFill,
    UnorderedListOutline,
    UserOutline,
  } from 'antd-mobile-icons'
import { TabBar } from "antd-mobile";

export default function Layout() {
    const navigate = useNavigate();
    const tabs = [
        {
          key: 'home',
          title: '首页',
          icon: <AppOutline />,
          onclick: () => {
            navigate('/')
          }
        //   badge: Badge.dot,
        },
        // {
        //   key: 'todo',
        //   title: '待办',
        //   icon: <UnorderedListOutline />,
        //   badge: '5',
        // },
        {
          key: 'messages',
          title: '对话',
          icon: (active: boolean) =>
            active ? <MessageFill /> : <MessageOutline />,
          badge: '99+',
          onclick: () => {
            navigate('/messages')
          }
        },
        // {
        //   key: 'personalCenter',
        //   title: '我的',
        //   icon: <UserOutline />,
        // },
      ]
    return (
        <div>
            <section style={{paddingBottom: '50px'}}>
                <Outlet />
            </section>
            <TabBar style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white' }}>
                {tabs.map(item => (
                    <TabBar.Item key={item.key} icon={item.icon} title={item.title} onClick={item.onclick}/>
                ))}
            </TabBar>
        </div>
    )
}