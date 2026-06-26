variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
}

provider "google" {
  project = var.project_id
  region  = "us-central1"
}

# The main Firebase project resource
resource "google_firebase_project" "default" {
  provider = google
  project  = var.project_id
}

# The specific Hosting site
resource "google_firebase_hosting_site" "processing_playground" {
  project = google_firebase_project.default.project
  site_id = "processing-playground"
}

output "site_url" {
  value = google_firebase_hosting_site.processing_playground.default_url
}
