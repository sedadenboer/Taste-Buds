import React from "react";
import './styles.css';

export default function Summary({ tracks, artists, genreList, image }) {
    return (
        <div class='card-summary'>
            <img src={image} class='card__image-summary' alt='' />
            <div class='card__body-summary' id='artistsSum'>
                <div class='summary-subtitle'>Top Artists</div>
                {artists.map(artist => <div>{artist}</div>)}
            </div>
            <div class='card__body-summary' id='tracksSum'>
                <div class='summary-subtitle'>Top Tracks</div>
                {tracks.map(track => <div>{track}</div>)}
            </div>
            <div class='card__body-summary' id='genresSum'>
                <div class='summary-subtitle'>Top Genres</div>
                <div>{genreList[0]}</div>
                <div>{genreList[1]}</div>
                <div>{genreList[2]}</div>
            </div>
        </div>
    )
}