import React, {memo} from 'react'
import { Loading } from './style'

function LoadingComponent() {
    return (
        <Loading>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <span>拼命加载中...</span>
        </Loading>
    )
}

export default memo(LoadingComponent)
