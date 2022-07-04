import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Col, Row, Button, Form } from "react-bootstrap";
import { BsXLg } from "react-icons/bs";
import { Link } from 'react-router-dom';
import classes from "../meat.module.css"
import { Context } from "../../../components/AppContext";

const DroneDetails = () => {
  const { droneCount, setDroneCount } = useContext(Context);
  const { meatNum } = useContext(Context);
  const [ cookies, setCookie ] = useCookies([
    "velocity", 
    "larvaeCount", 
    "meatCount", 
    "droneCount",
    "droneTime",
    "droneClick",
  ]);
  const [ droneStateValue, setDroneStateValue ] = useState(0);
  const [ droneClick, setDroneClick ] = useState(Number(cookies.droneClick) || 0);

  const handleDroneChange = (e) => {
    setDroneStateValue(e.target.value);
  }
  const handleHatch = () => {
    if(cookies.droneClick == 0) {
      const time = new Date();
      setCookie("droneTime", time ,{ path: '/' });
    }

    setDroneClick(Number(cookies.droneClick)+1)
    setCookie("droneClick", droneClick, {path: '/'});
    
    if(droneStateValue === 0) {
      alert("Please enter number");
    }
    if(cookies.droneCount === undefined) {
      setDroneCount(0 + Number(droneStateValue));
    }
    setDroneCount(Number(cookies.droneCount) + Number(droneStateValue));
    setDroneStateValue(0);
  }

  useEffect(() => {
    setCookie("droneClick", droneClick , { path: '/' });
  }, [droneClick])

  useEffect(() => {
    setCookie("droneCount", droneCount , { path: '/' });
  }, [droneCount])

  return (
    <div className={classes.droneDetails}>
      <Link 
        to="/larvae"
        className={classes.top_btn}
      >
        Drone
      </Link>
      <p>Drones are the lowest class of worker in your swarm. They continuously gather meat to feed your swarm.</p>
      <p>You own {cookies.droneCount == 0 ? "no" : cookies.droneCount} drones.</p>
      <p>Each produces {' '}
        {
          cookies.velocity === "seconds" ? "1.00000"
        : cookies.velocity === "minutes" ? "600"
        : cookies.velocity === "hours" ? "3,6000"
        : cookies.velocity === "days" ? "86,4000"
        : "900/wrap"
        }
          meat per {' '}
        {cookies.velocity}. (×1.00 bonus)
      </p>
      <p>In total, they produce {cookies.droneCount == 0 ? "1.0000" : cookies.droneCount  } meat per second</p>
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
        value={droneStateValue}
        onClick={handleHatch}
      >
        Hatch 
        { droneStateValue == "" ? 1 :
          droneStateValue*10 < meatNum ? droneStateValue : 
          Math.trunc(meatNum/10) 
        }
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