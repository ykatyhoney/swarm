import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Col, Row, Button, Form } from "react-bootstrap";
import { BsXLg } from "react-icons/bs";
import { Link } from 'react-router-dom';
import classes from "../meat.module.css"
import { Context } from "../../../components/AppContext";

const DroneDetails = () => {
  const { droneValue, setDroneValue } = useContext(Context);
  const { meatNum, setMeatNum } = useContext(Context);
  const [ cookies, setCookie ] = useCookies([
    "velocity", 
    "larvaeCount", 
    "meatCount", 
    "droneValue",
  ]);
  const [ droneStateValue, setDroneStateValue ] = useState(0)

  const handleDroneChange = (e) => {
    setDroneStateValue(e.target.value);
  }
  const handleHatch = () => {
    if(droneStateValue === 0) {
      alert("Please enter number")
    }
    if(cookies.droneValue === undefined) {
      setDroneValue(0 + Number(droneStateValue));
    }
    setDroneValue(Number(cookies.droneValue) + Number(droneStateValue));
  }
  useEffect(() => {
    setCookie("droneValue", droneValue , { path: '/' });
  }, [droneValue])

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
            onChange={handleDroneChange}
          />
        </Col>
        <Form.Label column sm="4">
          drone will cost {droneStateValue*10} meat and {droneStateValue} larva.
        </Form.Label>
      </Form.Group>
      <Button
        variant="outline-secondary"
        className={classes.hatch_btn}
        onClick={handleHatch}
      >
        Hatch { droneStateValue === "" ? 1 : droneStateValue*10 < meatNum ? droneStateValue : Math.trunc(meatNum/10) }
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