import React, { useState } from 'react';
import { Card, Col, Container, Image, Modal, Row } from 'react-bootstrap';

const ExpandableImage = ({src}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Card style={{width: "15rem", display: "block", marginLeft: "auto", marginRight: "auto"}}>
                <Card.Img className="clickable" variant="top" src={src} onClick={() => setOpen(true)}/>
            </Card>

            <Modal show={open} onHide={() => setOpen(false)}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Image src={src} fluid/>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ExpandableImage;