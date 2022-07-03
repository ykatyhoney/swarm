import { useCookies } from "react-cookie";
import { BsXLg } from "react-icons/bs";
import { Link } from 'react-router-dom';
import classes from "../meat.module.css"

const MeatDetails = () => {
    const [ cookies ] = useCookies(["meatCount"]);
    return (
        <div className={classes.meatDetails}>
            <Link 
                to="/larvae"
                className={classes.top_btn}
            >
                Meat
            </Link>
            <p>Meat is delicious. All of your swarm's creatures eat meat.</p>
            <p>You own {cookies.meatCount} meat.</p>
            <p>You earn 1.00000 meat per second.</p>
            <Link
                to="/meat"
                className={classes.close}
            >
                <BsXLg className={classes.close_btn} />
            </Link>
        </div>
    )
}

export default MeatDetails