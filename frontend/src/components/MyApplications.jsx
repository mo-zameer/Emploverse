import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearAllApplicationErrors,
  resetApplicationSlice,
  deleteApplication,
  fetchCandidateApplications,
} from "../store/slices/applicationSlice";
import Spinner from "../components/Spinner";

const MyApplications = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { loading, error, applications, message } = useSelector(
    (state) => state.applications
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCandidateApplications());
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
      dispatch(fetchCandidateApplications());
    }
  }, [dispatch, error, message]);

  const handleDeleteApplication = (id) => {
    dispatch(deleteApplication(id));
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : applications && applications.length <= 0 ? (
        <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>
          You have not applied for any job.
        </h1>
      ) : (
        <>
          <div className="account_components">
            <h3>My Application For Jobs</h3>
            <div className="applications_container">
              {applications.map((element) => {
                return (
                  <div className="card" key={element._id}>
                    <p className="sub-sec">
                      <span>Job Title: </span> {element.jobInfo.jobTitle}
                    </p>
                    <p className="sub-sec">
                      <span>Name</span> {element.candidateInfo.name}
                    </p>
                    <p className="sub-sec">
                      <span>Email</span> {element.candidateInfo.email}
                    </p>
                    <p className="sub-sec">
                      <span>Phone: </span> {element.candidateInfo.phone}
                    </p>
                    <p className="sub-sec">
                      <span>Address: </span> {element.candidateInfo.address}
                    </p>
                    <p className="sub-sec">
                      <span>Coverletter: </span>
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

export default MyApplications;