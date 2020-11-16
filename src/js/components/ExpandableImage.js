import React, { useEffect, useState } from 'react';
import { Card, Image, Modal } from 'react-bootstrap';

const ExpandableImage = ({src}) => {
    const [open, setOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        src.then(result => {
            setImageSrc(result);
        }).catch(error => {
            console.error(error);
        });
    }, [src]);

    return (
        <>
            <Card style={{width: "15rem", display: "block", marginLeft: "auto", marginRight: "auto"}}>
                <Card.Img className="clickable" variant="top" src={imageSrc} onClick={() => setOpen(true)}/>
            </Card>

            <Modal show={open} onHide={() => setOpen(false)}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Image src={imageSrc} fluid/>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ExpandableImage;