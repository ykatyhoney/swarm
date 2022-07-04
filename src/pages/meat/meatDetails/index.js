import { useCookies } from "react-cookie";
import { BsXLg } from "react-icons/bs";
import { Link } from 'react-router-dom';
import classes from "../meat.module.css"

const MeatDetails = () => {
    const [ cookies ] = useCookies(["velocity", "meatCount"]);
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
            <p>You earn {' '}
                { 
                  cookies.velocity === "seconds" ? "1.00000" :
                  cookies.velocity === "minutes" ? "60" :
                  cookies.velocity === "hours" ? "3,600" :
                  cookies.velocity === "days" ? "86,400" :
                  cookies.velocity === "swarmWarp" ? "900" : ""
                } 
              {' '}meat per second.
            </p>
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