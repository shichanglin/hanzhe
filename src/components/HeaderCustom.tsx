/**
 * Created by  on 2017/4/13.
 */
import React, { useEffect, useState } from "react";
import screenfull from "screenfull";
import avater from "../style/imgs/b1.jpg";
import SiderCustom from "./SiderCustom";
import { Menu, Layout, Popover } from "antd";
import { gitOauthToken, gitOauthInfo } from "../service";
import { parseQuery } from "../utils";
import { useHistory } from "react-router-dom";
import { PwaInstaller } from "./widget";
import { useAlita } from "redux-alita";
import umbrella from "umbrella-storage";
import { useSwitch } from "../utils/hooks";
import {
  ArrowsAltOutlined,
  BarsOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

type HeaderCustomProps = {
  toggle: () => void;
  collapsed: boolean;
  user: any;
  responsive?: any;
  path?: string;
};

const HeaderCustom = (props: HeaderCustomProps) => {
  const [user, setUser] = useState<any>();
  const [responsive] = useAlita("responsive", { light: true });
  const [visible, turn] = useSwitch();
  const history = useHistory();

  useEffect(() => {
    const query = parseQuery();
    let storageUser = umbrella.getLocalStorage("user");

    if (!storageUser && query.code) {
      gitOauthToken(query.code as string).then((res: any) => {
        gitOauthInfo(res.access_token).then((info: any) => {
          setUser({
            user: info,
          });
          umbrella.setLocalStorage("user", info);
        });
      });
    } else {
      setUser({
        user: storageUser,
      });
    }
  }, []);

  const screenFull = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  };
  const menuClick = (e: any) => {
    e.key === "logout" && logout();
  };
  const logout = () => {
    umbrella.removeLocalStorage("user");
    history.push("/login");
  };
  return (
    <Header className="custom-theme header">
      <Menu
        mode="horizontal"
        style={{ lineHeight: "64px", float: "right" }}
        onClick={menuClick}
      >
        <Menu.Item key="pwa">
          <PwaInstaller />
        </Menu.Item>
        <Menu.Item key="full">
          <ArrowsAltOutlined onClick={screenFull} />
        </Menu.Item>

        <SubMenu
          title={
            <span className="avatar">
              <img src={avater} alt="??????" />
              <i className="on bottom b-white" />
            </span>
          }
        >
          <MenuItemGroup title="????????????">
            <Menu.Item key="setting:1">?????? - {user?.userName}</Menu.Item>
            <Menu.Item key="setting:2">????????????</Menu.Item>
            <Menu.Item key="logout">
              <span onClick={logout}>????????????</span>
            </Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup title="????????????">
            <Menu.Item key="setting:3">????????????</Menu.Item>
            <Menu.Item key="setting:4">????????????</Menu.Item>
          </MenuItemGroup>
        </SubMenu>
      </Menu>
    </Header>
  );
};

export default HeaderCustom;
