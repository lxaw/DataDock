import React from "react";
import { connect } from "react-redux";

const About = (props) => {
  return (
    <div className="container my-5">
      <section className="mb-5">
        <h1 className="display-4 mb-4">About Delta</h1>
        <p className="lead">
          The <a href="https://github.com/lxaw/Delta">Delta</a> application is a platform designed for researchers to efficiently share data sets,
          collaborate with fellow scholars, provide valuable feedback, and streamline their research workflow.
        </p>
      </section>

      <section className="mb-5">
        <h1 className="display-4 mb-4">Why Use Delta?</h1>
        <p className="lead">
          Delta bridges the gap between modern file transfer services and the unique needs of researchers. By incorporating social media-inspired features into
          the file transfer system, Delta enables researchers to not only share files but also engage in meaningful discussions and evaluations of the shared data.
          This innovative approach fosters a more collaborative and efficient research environment.
        </p>
      </section>

      <section className="mb-5">
        <h1 className="display-4 mb-4">Getting Started with Delta</h1>
        <ol className="list-group">
          <li className="list-group-item">Register as an individual or under an organization (if you are part of a lab or research group).</li>
          <li className="list-group-item">Upload files by visiting the file upload page, as shown in the carousel below. Organize files by organization or tags for easy access.</li>
          <li className="list-group-item">Explore files uploaded by others, write reviews, and engage in direct messaging to initiate conversations related to specific files.</li>
          <li className="list-group-item">Easily search and download files based on file names or tags.</li>
        </ol>
      </section>

      <section>
        <h1 className="display-4 mb-4">Open Source Contribution</h1>
        <p className="lead">
          Delta is an open source project, and we welcome contributions from the community. If you have ideas for improvements, new features, or bug fixes, we encourage you to get involved:
        </p>
        <ul className="list-group mb-4">
          <li className="list-group-item">Fork the <a href="https://github.com/lxaw/Delta">Delta repository</a> on GitHub.</li>
          <li className="list-group-item">Create a new branch for your changes.</li>
          <li className="list-group-item">Make your modifications and enhancements.</li>
          <li className="list-group-item">Submit a pull request detailing your changes.</li>
          <li className="list-group-item">If you encounter any issues or have suggestions, please <a href="https://github.com/lxaw/Delta/issues">create an issue</a> on the GitHub repository.</li>
        </ul>
        <p className="lead">
          Your contributions help make Delta a better platform for the research community. Together, we can create a powerful tool that revolutionizes the way researchers collaborate and share knowledge.
        </p>
      </section>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(About);