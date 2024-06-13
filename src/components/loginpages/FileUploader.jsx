import React from 'react'

const FileUploader = ({ signupUserData, fileHandler }) => {
    return (
        <div className='b-radius-50 file_container'>
            <label
                htmlFor='file'
                className='cursor-pointer'>
                <img
                    loading='lazy'
                    style={{ borderRadius: "50px" }}
                    width="50px"
                    height="50px"
                    src={signupUserData.avatar ? URL.createObjectURL(signupUserData.avatar) : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJYMIg4H1MKoEBPkF1kWQ7ENkm2gXsgF8bsg&s'}
                    alt='img' />
            </label>
            <input
                style={{ display: 'none' }}
                type='file'
                title='upload image'
                accept='image/*'
                id='file'
                onChange={fileHandler} />

        </div>
    )
}

export default FileUploader