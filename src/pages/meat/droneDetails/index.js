import React, { useContext, useState } from "react";
import { Col, Row, Button, Form } from "react-bootstrap";
import { BsXLg } from "react-icons/bs";
import { Link } from 'react-router-dom';
import classes from "../meat.module.css"
import { Context } from "../../../components/AppContext";

const DroneDetails = () => {
  const { droneValue, setDroneValue } = useContext(Context);
  const { meatNum, setMeatNum } = useContext(Context);
  const handleDrone = (e) => {}
  const handleHatch = (e) => {
    setDroneValue(e.target.value);
  }

  console.log("meatnum", meatNum)
  return (
    <div className={classes.droneDetails}>
      <Link 
        to="/larvae"
        className={classes.top_btn}
      >
        Drone
      </Link>
      <p>Drones are the lowest class of worker in your swarm. They continuously gather meat to feed your swarm.</p>
      <p>You own no drones.</p>
      <p>Each produces 1.00000 meat per second. (×1.00 bonus)</p>
      <div className={classes.divider} />
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="1">
          Hatching
        </Form.Label>
        <Col sm="4">
          <Form.Control 
            type="text" 
            placeholder="1" 
            value={droneValue}
            onChange={handleDrone}
          />
        </Col>
        <Form.Label column sm="4">
          drone will cost 10 meat and 1 larva.
        </Form.Label>
      </Form.Group>
      <Button
        variant="outline-secondary"
        className={classes.hatch_btn}
      >
        Hatch { droneValue === 0 ? 1 : droneValue}
      </Button>
      <Button
        variant="outline-secondary"
        className={classes.hatch_btn}
        onClick={handleHatch}
      >
        Hatch { Math.trunc(meatNum/10) }
      </Button>
      <Link
        to="/meat"
        className={classes.close}
      >
        <BsXLg className={classes.close_btn} />
      </Link>
    </div>
  )
}

export default DroneDetails