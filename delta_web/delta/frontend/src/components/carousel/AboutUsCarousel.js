/**
 * Delta Projct
 * 
 * Authors:
 * Lexington Whalen (@lxaw)
 * Carter Marlowe (@Cmarlowe123)
 * Vince Kolb-Lugo (@vancevince)
 * Blake Seekings (@j-blake-s)
 * Naveen Chithan (@nchithan)
 * 
 * AboutUsCarousel.js
 * 
 * A simple carousel component to display actions of the Delta app in use.
 */
import Reach, { Component } from 'react'

export class AboutUsCarousel extends Component {
  render() {
    return (
      <div id='carouselExampleSlidesOnly' className='carousel slide' data-bs-ride='carousel'>
        <div className='carousel-inner'>
          <div className='carousel-item active'>
            <img
              src="/media/Website-Register.png"
              className="img-fluid"
              alt="registration-page"
              height="1080"
              width="1920"
            />
          </div>
          <div className='carousel-item'>
            <img
              src="/media/Home-page-initial-signup.png"
              className="img-fluid"
              alt="home page after initial registration"
              height="1080"
              width="1920"
            />
          </div>
          <div className='carousel-item'>
            <img
              src="/media/Website-Home-Page.png"
              className="img-fluid"
              alt="home page blank"
              height="1080"
              width="1920"
            />
          </div>
          <div className='carousel-item'>
            <img
              src="/media/Profile-Preupdate.png"
              className="img-fluid"
              alt="profiel page before updating information"
              height="1080"
              width="1920"
            />
          </div>
          <div className='carousel-item'>
            <img
              src="/media/Profile-postupdate.png"
              className="img-fluid"
              alt="profile page after updating information"
              height="1080"
              width="1920"
            />
          </div>
          <div className='carousel-item'>
            <img
              src="/media/Website-Upload.png"
              className="img-fluid"
              alt="upload page"
              height="1080"
              width="1920"
            />
          </div>
          <div className='carousel-item'>
            <img
              src="/media/Website-Upload-File-uploaded.png"
              className="img-fluid"
              alt="upload page after uploading file"
              height="1080"
              width="1920"
            />
          </div>
          <div className='carousel-item'>
            <img
              src="/media/Website-Download.png"
              className="img-fluid"
              alt="download page"
              height="1080"
              width="1920"
            />
          </div>
          <div className='carousel-item'>
            <img
              src="/media/Website-Download-Queue.png"
              className="img-fluid"
              alt="download page, queue"
              height="1080"
              width="1920"
            />
          </div>
          <div className='carousel-item'>
            <img
              src="/media/Website-Download-file-downloaded.png"
              className="img-fluid"
              alt="download page after downloading file"
              height="1080"
              width="1920"
            />
          </div>
          <div className='carousel-item'>
            <img
              src="/media/Community-page.png"
              className="img-fluid"
              alt="community page"
              height="1080"
              width="1920"
            />
          </div>
          <div className='carousel-item'>
            <img
              src="/media/Community-page-specific-organization.png"
              className="img-fluid"
              alt="registration-page"
              height="1080"
              width="1920"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default AboutUsCarousel