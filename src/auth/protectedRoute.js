import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth";

export const ProtectedRoute = ({component: Component,...rest}) => {
    const [isVerifiedDone, setVerifyDone] = React.useState(false);
    const [verifyResult, setVerifyResult] = React.useState(false);

    useEffect(()=>{
        const verifyProcess = async () => {
            const result = await auth.verifyAccessToken();
            setVerifyResult(result);
            setVerifyDone(true);
        };
        verifyProcess();

        // console.log("Testing get params: ", {...rest});
        }, []);

    return (
            !isVerifiedDone ? null :
            <Route
            {...rest}
            render={props => {
                
                if (verifyResult) {
                    return <Component {...props} />;
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: {
                                    to: props.location
                                }
                            }}
                        />
                    );
                }
            }}
        />
    );
};
