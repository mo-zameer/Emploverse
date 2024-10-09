import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearAllApplicationErrors,
  deleteApplication,
  fetchRecruiterApplications,
  resetApplicationSlice,
} from "../store/slices/applicationSlice";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";

const Applications = () => {
  const { applications, loading, error, message } = useSelector(
    (state) => state.applications
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
    }
    dispatch(fetchRecruiterApplications());
  }, [dispatch, error, message]);

  const handleDeleteApplication = (id) => {
    dispatch(deleteApplication(id));
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : applications && applications.length <= 0 ? (
        <h1>You have no applications from candidates.</h1>
      ) : (
        <>
          <div className="account_components">
            <h3>Applications For Your Posted Jobs</h3>
            <div className="applications_container">
              {applications.map((element) => {
                return (
                  <div className="card" key={element._id}>
                    <p className="sub-sec">
                      <span>Job Title: </span> {element.jobInfo.jobTitle}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's Name: </span>{" "}
                      {element.candidateInfo.name}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's Email:</span>{" "}
                      {element.candidateInfo.email}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's Phone: </span>{" "}
                      {element.candidateInfo.phone}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's Address: </span>{" "}
                      {element.candidateInfo.address}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's CoverLetter: </span>
                      <textarea
                        value={element.candidateInfo.coverLetter}
                        rows={5}
                        disabled
                      ></textarea>
                    </p>
                    <div className="btn-wrapper">
                      <button
                        className="outline_btn"
                        onClick={() => handleDeleteApplication(element._id)}
                      >
                        Delete Application
                      </button>
                      <Link
                        to={
                          element.candidateInfo &&
                          element.candidateInfo.resume.url
                        }
                        className="btn"
                        target="_blank"
                      >
                        View Resume
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Applications;