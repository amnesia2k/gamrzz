import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select("*, company: companies(name, logo_url), saved: saved_jobs(id)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch jobs:", error);
    return null;
  }

  return data;
}

export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);

    if (deleteError) {
      console.error("Failed to delete saved jobs:", deleteError);
      return null;
    }

    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Failed to fetch jobs:", insertError);
      return null;
    }

    return data;
  }
}

export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select(
      "*, company: companies(name, logo_url), applications: applications(*)"
    )
    .eq("id", job_id)
    .single();

  if (error) {
    console.error("Failed to fetch jobs:", error);
    return null;
  }

  return data;
}

export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Failed to update jobs:", error);
    return null;
  }

  return data;
}

export async function getCompanies(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Failed to fetch companies:", error);
    return null;
  }

  return data;
}

export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const rand = Math.floor(Math.random() * 90000);
  const fileName = `app-${rand}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) {
    console.error("Error uploading resume:", error);
    return null;
  }

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  const { data, error } = await supabase
    .from("applications")
    .insert([{ ...jobData, resume }])
    .select();

  if (error) {
    console.error("Failed to submitting application:", error);
    return null;
  }

  return data;
}

export async function updateApplications(token, { job_id }, status) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select("*");

  if (error || data.length === 0) {
    console.error("Failed to update application status:", error);
    return null;
  }

  return data;
}

export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error("Failed to create job:", error);
    return null;
  }

  return data;
}

export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);

  const rand = Math.floor(Math.random() * 90000);
  const fileName = `logo-${rand}-${companyData.name}`;

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo);

  if (storageError) {
    console.error("Error uploading company logo:", error);
    return null;
  }

  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url,
      },
    ])
    .select();

  if (error) {
    console.error("Failed to create new company:", error);
    return null;
  }

  return data;
}

export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name, logo_url))");

  if (error) {
    console.error("Failed to get saved job:", error);
    return null;
  }

  return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("applications")
    .select("*, job: jobs(title, company: companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Failed to get applications:", error);
    return null;
  }

  return data;
}

export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name, logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Failed to get jobs:", error);
    return null;
  }

  return data;
}

export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Failed to delete job:", error);
    return null;
  }

  return data;
}
