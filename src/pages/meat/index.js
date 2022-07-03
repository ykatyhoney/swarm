import { useContext } from "react";
import { Col, Row } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { Context } from "../../components/AppContext";
import classes from "./meat.module.css";

const Meat = () => {
    const { droneValue, meatNum } = useContext(Context);
    return (
        <Row className={classes.height}>
            <Col md={3}>
                <Link className={classes.drone} to="drone">
                    <div className={classes.drone_name}>Drone</div>
                    <div className={classes.drone_value}>{droneValue}</div>
                </Link>
                <Link className={classes.meat} to="meat">
                    <div className={classes.drone_name}>Meat</div>
                    <div className={classes.drone_value}>{meatNum}</div>
                </Link>
            </Col>
            <Col md={9}>
                <Outlet />
            </Col>
        </Row>
    )
}

export default Meat