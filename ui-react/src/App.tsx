import React from 'react';
import Navigation from "./components/navigation/Navigation";
import {Route, Routes} from "react-router-dom";
import Login from "./components/login/Login";
import {useIsLoggedIn} from "./store/auth/auth.hooks";

function App() {
    const isLoggedIn = useIsLoggedIn();
  return (
    <div className="App">
        <Navigation/>
        <div className="main">
            {/* Define all the routes */}
            <Routes>
                {/*<Route path="/" element={<Home />}></Route>*/}
                {!isLoggedIn && <Route path="login" element={<Login />}></Route>}
                {/*<Route path="recipe" element={<Recipe />}></Route>*/}
                {/*<Route path="recent-recipes" element={<RecentRecipes />}></Route>*/}
                {/*<Route path="recipe/:id" element={<Recipe />}></Route>*/}
                {/*<Route path="users" element={<Users />}></Route>*/}
                {/*<Route path="users/:id" element={<User />}></Route>*/}
            </Routes>
        </div>
    </div>
  );
}

export default App;
