import { Outlet } from 'react-router-dom'
import {Top, Tab, TabItem} from './style'
import { NavLink } from 'react-router-dom'
import { memo } from 'react'
import Player from '../Player'
import { useNavigate } from 'react-router-dom'


function Home(props) {
  const navigate = useNavigate()
    return (
        <div>
            <Top>
                <span className="iconfont menu">&#xe65c;</span>
                <span className="title">网易云音乐</span>
                <span className="iconfont search" onClick={() => navigate('/search')}>&#xe62b;</span>
            </Top>
            <Tab>
                <NavLink
                    to="/recommend"
                    className={({ isActive }) => (isActive ? 'selected' : '')}
                >
                    <TabItem>
                        <span>推荐</span>
                    </TabItem>
                </NavLink>
                <NavLink
                    to="/singers"
                    className={({ isActive }) => (isActive ? 'selected' : '')}
                >
                    <TabItem>
                        <span>歌手</span>
                    </TabItem>
                </NavLink>
                <NavLink
                    to="/rank"
                    className={({ isActive }) => (isActive ? 'selected' : '')}
                >
                    <TabItem>
                        <span>排行</span>
                    </TabItem>
                </NavLink>
        </Tab>
        <Player />
            <Outlet />
        </div>
    )
}

export default memo(Home)
