import React from "react";
import "./index.css"

export default function Input({ type, className, placeholder, icon }) {
    return(
        <div className={`input-wrapper ${className}`}>
            {icon && <span className="input-icon">{icon}</span>}
            <input
                type={type}
                className={`form-control ${className}`}
                placeholder={placeholder}
            />
            
        </div>
    )
}