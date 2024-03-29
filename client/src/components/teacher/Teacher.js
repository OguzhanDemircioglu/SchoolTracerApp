import React, {useEffect, useState} from 'react';
import "../../App.css";
import {BASE_URL} from "../../common/constant";
import {Button, Input} from "@mui/material";
import Modal from "react-modal";

const Teacher = () => {

    const [item, setItem] = useState([]);
    const [itemId, setItemId] = useState(-1);
    const [indexCount, setIndexCount] = useState([]);
    const [itemCount, setItemCount] = useState([]);
    const [name, setName] = useState(null);
    const [surname, setSurname] = useState(null);
    const [tckn, setTckn] = useState(null);
    const [switchModal, setSwitchModal] = useState(false);
    const [searchKey, setSearchKey] = useState(null);

    const getTeachersByDetail = () => {
        fetch(BASE_URL + 'teacher/getTeachersByDetail')
            .then(response => {
                if (!response.ok) {
                    throw new Error('İşlem şuan gerçekleştirilemiyor');
                }
                return response.json();
            })
            .then(data => {
                setItem(data);
                setIndexCount(data.length + 1);
                setItemCount(data[data.length - 1].id + 1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const insertTeacher = () => {

        if(name===null || surname===null){
            alert("İsim, Soyİsim Boş olamaz");
            return;
        }

        if (tckn===null || !/^\d{0,11}$/.test(String(tckn))) {
            alert("TCKN 11 Haneli Bir Sayı Olmalı");
            return;
        }

        if(item.map(t=> t.tckn).filter(i=> i===tckn)){
            alert("Aynı TCKN ile Kayıt Yapılamaz");
            return;
        }

        fetch(BASE_URL + 'teacher/save', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({name, surname, tckn})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('İşlem şuan gerçekleştirilemiyor');
                }
                return response.json();
            })
            .then(data => {
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        window.location.reload();
    }

    function deleteTeacher() {
        fetch(BASE_URL + `teacher/deleteTeacherById/${itemId}`, {
            method: 'DELETE', headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('İşlem şuan gerçekleştirilemiyor');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        window.location.reload();
    }

    const toggleModal = () => {
        setSwitchModal(!switchModal);
    };

    useEffect(() => {
        getTeachersByDetail();
    }, []);

    return (<>
        <Input type="text" placeholder="SearchByName..." className="card"
               onChange={(e) => setSearchKey(e.target.value.toLowerCase())}/>
        <table id="table1">
            <thead>
            <tr>
                <th></th>
                <th>ID</th>
                <th>Name</th>
                <th>Surname</th>
                <th>TCKN</th>
                <th>About</th>
                <th>Crud</th>
            </tr>
            </thead>
            <tbody>
            {item?.filter(i => !searchKey || i.name.includes(searchKey)).map((item, index) => {
                return (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.surname}</td>
                    <td>{item.tckn}</td>
                    <td>
                        <Button onClick={toggleModal} type="button">Detail</Button>
                        <Modal
                            isOpen={switchModal}
                            onRequestClose={toggleModal}
                            style={{
                                overlay: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                                }, content: {
                                    width: '20%',
                                    height: '40%',
                                    margin: 'auto',
                                    backgroundColor: 'white',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    outline: 'none',
                                    padding: '20px',
                                    textAlign: "center"
                                }
                            }}
                        >
                            <h3>Teacher Detail</h3>
                            <table id="table2">
                                <tbody>
                                <tr>
                                    <img style={{width: "25%"}} src="/img/t1.png" alt=""/>
                                </tr>
                                <tr>
                                    <td>Name Surname: {item.name} {item.surname}</td>
                                </tr>
                                <tr>
                                    <td>TCKN: {item.tckn}</td>
                                </tr>
                                <tr>
                                    <td>STUDENT COUNT: {item.studentCount}</td>
                                </tr>
                                <tr>
                                    <td>BEST GRADE: {item.maxGrade}</td>
                                </tr>
                                <tr>
                                    <td>AVERAGE GRADE: {item.avarageGrade}</td>
                                </tr>
                                </tbody>
                            </table>
                            <br/>
                            <button
                                onClick={toggleModal}>Close Modal
                            </button>
                        </Modal>
                    </td>
                    <td>
                        <Button onMouseUp={() => {
                            setItemId(item.id)
                        }}
                                onClick={deleteTeacher}
                        >Delete</Button>
                    </td>
                </tr>)
            })}
            <tr>
                <td>{indexCount}</td>
                <td>{itemCount}</td>
                <td>
                    <input type="text" placeholder="Enter Name"
                           onChange={e => setName(e.target.value)}/>
                </td>
                <td>
                    <input type="text" placeholder="Enter Surname"
                           onChange={e => setSurname(e.target.value)}/>
                </td>
                <td>
                    <input type="text" placeholder="Enter TCKN" maxLength={11}
                           onChange={e => setTckn(e.target.value)}/>
                </td>
                <td/>
                <td>
                    <Button type={"submit"} onClick={insertTeacher}>Add</Button>
                </td>
            </tr>
            </tbody>
        </table>
    </>);
};

export default Teacher;