import React from "react";
import { Grid } from "@material-ui/core";
import './styles.css';

export default function TopGenresResult({ genreList }) {
    return (
        <Grid item>
            {/* Display the first 5 items of top genres */}
            <div className='top-genres'>
                <h1>1. {genreList[0]}</h1>
                <h2>2. {genreList[1]}</h2>
                <h2>3. {genreList[2]}</h2>
                <h2>4. {genreList[3]}</h2>
                <h2>5. {genreList[4]}</h2>
            </div>
        </Grid>
    )
}