import { useState } from "react";
import cssColors from "../../cssColors";

function Card({ house = {} }) {
  const [searchText, setSearchText] = useState([]);

  const getValidColors = (houseColors) => {
    const colors = houseColors
      .split(" and ")
      .map((color) => color.toLowerCase());

    const isValidFirst = cssColors.includes(colors[0]);
    // this checks if a second color is present in the houseColours
    const isValidSecond = colors[1] ? cssColors.includes(colors[1]) : false;

    return isValidFirst && isValidSecond ? colors : ["white", "black"];
  };
  const colors = getValidColors(house.houseColours);
  function handleInputChange(text) {
    setSearchText(text);
  }
  const filteredTraits = house.traits
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
          <span className="founder">
            {" " + house.heads[1].firstName + " " + house.heads[1].lastName}
          </span>
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
