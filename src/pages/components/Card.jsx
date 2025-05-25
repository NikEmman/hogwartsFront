import { useState } from "react";
import cssColors from "../../../cssColors";

function Card({ house = {} }) {
  const [searchText, setSearchText] = useState([]);

  function getValidColors(houseColours) {
    // If houseColours is undefined or not a string, return default colors
    if (!houseColours || typeof houseColours !== "string") {
      return ["white", "black"];
    }

    const colors = houseColours
      .split(" and ")
      .map((color) => color.toLowerCase());

    const isValidFirst = cssColors.includes(colors[0]);
    const isValidSecond = colors[1] ? cssColors.includes(colors[1]) : false;

    return isValidFirst && isValidSecond ? colors : ["white", "black"];
  }
  function getHeadName(heads) {
    if (!heads || heads.length === 0) {
      return " Unknown";
    }
    return ` ${heads[1].firstName}` + " " + `${heads[1].lastName}`;
  }
  const headName = getHeadName(house.heads);
  const colors = getValidColors(house.houseColours);
  function handleInputChange(text) {
    setSearchText(text);
  }
  // Ensure house.traits is an array; default to empty array if undefined
  const traits = Array.isArray(house.traits) ? house.traits : [];

  const filteredTraits = traits
    .filter((trait) => trait.name.toLowerCase().includes(searchText))
    .map((trait) => {
      return (
        <div key={trait.id} className="trait">
          {trait.name}
        </div>
      );
    });
  return (
    <>
      <div className="cardContainer">
        <div className="title">
          <h2>{house.name}</h2>
          <p>{house.animal}</p>
        </div>
        <div
          style={{
            width: "100%",
            height: "25px",
            background: `linear-gradient(to right, ${colors[0]}, ${colors[1]})`,
            borderRadius: "8px",
          }}
        />
        <p>
          Founder:
          <span className="founder">{headName}</span>
        </p>
        <input
          onChange={(e) => handleInputChange(e.target.value)}
          type="search"
          value={searchText}
          placeholder="Search house traits"
        />
        <div className="traitContainer"> {filteredTraits}</div>
      </div>
    </>
  );
}
export default Card;
