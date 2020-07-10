import React, {useEffect, useState} from "react";
import Table from "../components/app/Table";
import {useSelector, useDispatch} from "react-redux";
import {
    $deleteUser,
    $fetchUsers,
    $isUse,
    $pushSortData,
    $updateUser, $signUpUser
} from '../modules/api/user'
import Pagination from "../components/app/Pagination";
import LineChart from "../components/chart/LineChart";
import BarChart from "../components/chart/BarChart";
import {_bindData} from "../modules/static/support";
import AppPopUp from "../components/app/AppPopUp";
import {Button} from "react-bootstrap";

export default () => {

    const dispatch = useDispatch()

    const initUser = useSelector(state => state.userReducer, []);

    const [isOpen , setIsOpen] = useState(false)

    const [userInfo, setUserInfo] = useState(undefined)

    useEffect(() => {
        $fetchUsers(dispatch, initUser)
    }, []);

    const _onReFresh = (val) => {
        initUser.page = val
        $fetchUsers(dispatch, initUser)
    }

    const filter = [
        {key: 'email', name: "이메일" , type : "email"},
        {key: 'password', name: "비밀번호" , type :"password"},
        {key: 'birthDate', name: "생년월일" , type :"date"},
        {key: 'address', name: "주소" , type: ""},
        {key: 'isUse', name: "상태" , type: "boolean"},
        {key: 'createdAt', name: "등록일" , type: "date"}
    ]

    const payload = _bindData(initUser.users , filter);

    const  _isUse = (idx, flag) => {
        const data = initUser.users.content[idx]
        $isUse(dispatch, idx, data, flag)
    }

    const _onEdit = (idx) => {
        let data = payload.data[idx]
        setUserInfo(data)
        setIsOpen(true)
    }

    const _onDelete = (idx) => {
        const seq = payload.data[idx].seq;
        $deleteUser(dispatch, seq)
        $fetchUsers(dispatch, initUser)
    }

    const _sortTable = (idx) => {
        const key = payload.key[idx]
        $pushSortData(dispatch, key)
    }

    const _onHidden = () =>{
       setIsOpen(false)
    }

    const _onUpdate = (data) =>{
        if (typeof data.seq == 'undefined' ){
            $signUpUser(dispatch, data)
        }else{
            $updateUser(dispatch , data)
        }
        setIsOpen(false)
        $fetchUsers(dispatch, initUser)
    }

    const _onCreate = () => {
        setIsOpen(true)
        setUserInfo({
            email: '',
            password: '',
            birthDate: '',
            address: '',
            isUse: false,
            createAt: '',
        })
    }

    return (
        <div className="container-main">

            <AppPopUp open={isOpen}
                      close={_onHidden}
                      data={userInfo}
                      keys={filter}
                      update={_onUpdate}
            />

            <div className="card-group">
                <div className="card card-user card-bg">
                    <div className="card-title ml-2 mt-1">
                        <span className="main-ft">사용자 추이</span>
                    </div>
                    <div className="card-body">
                        <LineChart/>
                    </div>
                </div>
                <div className="card card-user card-bg">
                    <div className="card-title ml-2 mt-1">
                        <span className="main-ft">사용자 추이</span></div>
                    <div className="card-body">
                        <BarChart/>
                    </div>
                </div>
            </div>

            <div className="mt-2 btn-box">
                <Button onClick={_onCreate}>Input</Button>
            </div>

            <div className="mt-2">

                <Table data={payload.data}
                       keys={payload.key}
                       switch={_isUse}
                       update={_onEdit}
                       delete={_onDelete}
                       sort={_sortTable}
                       sortData={initUser.sort}
                />

                <Pagination count={payload.count}
                            numPages={payload.numPages}
                            showPages={payload.showPages}
                            refresh={_onReFresh}
                            page={initUser.page}
                />
            </div>

        </div>
    )
}
