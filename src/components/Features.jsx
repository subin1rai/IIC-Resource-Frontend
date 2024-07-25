import React, { useEffect, useState } from "react";
import FeatureTable from "../components/FeatureTable";
import axios from "axios";
import "../styles/category.css";
import { useNavigate } from "react-router-dom";
import close from "../assets/close.svg";

const Features = () => {
  const [feature, setFeature] = useState([]);
  const [newFeature, setNewFeature] = useState({
    feature_name: "",
  });
  const [error, setError] = useState("");
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const response = await axios.get("http://localhost:8898/api/feature", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setFeature(response.data.feature || []);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request Canceled", error.message);
          return;
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, []);

  const displayAddPopup = () => {
    setAddFormVisibility(true);
  };

  const closeCategoryForm = () => {
    setError("");
    setAddFormVisibility(false);
  };

  const handleChange = (e) => {
    setNewFeature((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    console.log(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8898/api/addFeature",
        newFeature,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };

  return (
    <>
      <div className="first">
        <div className="head">
          <div className="container">
            <p>Features</p>
          </div>

          <div className="icons">
            <button className="add-buttons" onClick={displayAddPopup}>
              Add Feature
            </button>
          </div>
        </div>

        <FeatureTable feature={feature} setFeature={setFeature} />

        {addFormVisibility && (
          <form action= "" onSubmit={handleSubmit} className="category-form">
            <button
              type="button"
              className="discard-button"
              onClick={closeCategoryForm}
            >
              <img src={close} alt="Close" />
            </button>
            <p className="title">Add Feature</p>
            <h2>Example: Brand, Size, Colour</h2>
            <div className="field">
              <label htmlFor="feature_name">Feature Name</label>
              <input
                type="text"
                 placeholder=""
                name="feature_name"
                id="feature_name"

                onChange={handleChange}
                autoFocus="autofocus"
              />
            </div>
            {error && <span className="text-red-500 ml-4">{error}</span>}
            <div className="buttons">
              <button type="submit" className="add-buttons">
                Add Feature
              </button>
            </div>
          </form>
        )}

        {addFormVisibility && (
          <div className="overlay-category" onClick={closeCategoryForm}></div>
        )}
      </div>
    </>
  );
};

export default Features;
