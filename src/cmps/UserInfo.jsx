import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux' 
import { useNavigate } from 'react-router-dom'

export function UserInfo() {
      const user = useSelector(storeState => storeState.userModule.user)

    return (
    <div class="profile-right-side">
    
    <section class="profile-header">
        
       
        <button class="btn-edit">Edit profile</button>
    </section>

    <section class="about-section">
        <h2>About</h2>
        <p class="about-text">Hello, my name is {user.fullName}</p>
        
      
    </section>

    <section class="reviews-section">
        <h2>⭐ 1 review PLACEHOLDER</h2>
        </section>

</div>
    )
}