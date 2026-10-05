"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import profile from "@/public/logo/default_profile.svg";
import styles from './AvatarUpload.module.scss';

const AvatarUpload = ({ 
    userAvatar, 
    uploadHandler,
    acceptTypes = ".png, .jpg, .jpeg, .gif"
}) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (file) => {
        setSelectedFile(file);
        if (uploadHandler) {
            uploadHandler(file);
        }
    };

    const currentAvatar = selectedFile 
        ? URL.createObjectURL(selectedFile) 
        : (userAvatar || profile);

    return (
        <div className={styles.avatarUpload}>
            <form>
                <div 
                    className={styles.avatarContainer}
                    onClick={() => document.getElementById('avatar-file-upload').click()}
                >
                    <Image
                        src={currentAvatar}
                        width={100}
                        height={100}
                        alt="Profile avatar"
                        unoptimized
                        className={styles.defaultImage}
                    />
                    <input
                        id="avatar-file-upload"
                        type="file"
                        accept={acceptTypes}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                handleFileChange(file);
                            }
                        }}
                        hidden
                    />
                </div>
            </form>
        </div>
    );
};

export default AvatarUpload;