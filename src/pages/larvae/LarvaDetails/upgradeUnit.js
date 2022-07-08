import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import classes from "../larvae.module.css";
import { useContext } from "react";
import { Context } from "../../../context/AppContext";

const UpgradeUnit = () => {
  const { 
    hatcheryClick,
    upgradeNotify, setUpgradeNotify,
  } = useContext(Context);

  const handleUpgradeSelect = (eventKey) => {
    setUpgradeNotify(eventKey);
  };

  return (
    <div className={classes.flex}>
      <p>Hatchery ({hatcheryClick})</p>
      <div className={classes.flex}>
        <BsFillArrowUpCircleFill color="#337ab7" />
        <Dropdown onSelect={handleUpgradeSelect}>
          <Dropdown.Toggle 
            className={classes.toggle_btn} 
            variant="outline-secondary"
            id="dropdown-basic"
          >
            Theme
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey='hide' >Hide upgrade</Dropdown.Item>
            <Dropdown.Item eventKey='never' >Never notify</Dropdown.Item>
            <Dropdown.Item eventKey='buyable' >Notify when buyable</Dropdown.Item>
            <Dropdown.Item eventKey='2cost' >Notify at 2* cost</Dropdown.Item>
            <Dropdown.Item eventKey='4cost' >Notify at 4* cost</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}

export default UpgradeUnit