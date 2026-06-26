variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
}

provider "google" {
  project = var.project_id
  region  = "us-central1"
}

provider "google-beta" {
  project = var.project_id
  region  = "us-central1"
}

# The specific Hosting site
resource "google_firebase_hosting_site" "processing_playground" {
  provider = google-beta
  project  = var.project_id
  site_id  = "processing-playground"
}

output "site_url" {
  value = google_firebase_hosting_site.processing_playground.default_url
}
