import { useState, useRef } from "react";
import profile from "../images/profile.png";



    const fileInputRef = useRef()
    const [profileImage, setProfileImage] = useState(profile)



       const updateProfileImage = async (body) => {
    try {
      const res = await fetch(`${API}/me`, {
        method: "PUT",
        credentials: "include",
        body: {profilePic: body},
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong,please try again");
        return;
      }

      alert("Updated");
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };



  const deleteProfileImage = async () => {
    try {
      const res = await fetch(`${API}/me`, {
        method: "PUT",
        credentials: "include",
        body: {profilePic: profile}
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "something went wrong, please try again");
        return;
      }

      setProfileImage(profile)
      alert("Deleted");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.log(err);
      alert("Network error");
    }
  };


    const handleFileInputClick = () => {
        fileInputRef.current.click()
    }



    const handleFileChange = async (e) => {

        const file = e.target.files[0]
        if(!file){
            return
        }


        const previewUrl = URL.createObjectURL(file)
        setProfileImage(previewUrl)

        const formData = new FormData()
        formData.append("image", file)

        updateProfileImage(formData)


    }
