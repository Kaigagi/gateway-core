variable "project_id" {
    type = string
    description = "Project Id"
}

variable "zone_name" {
    type = string
    default = "asia-east1-b" 
}

variable "machine_type" {
  description = "GCP machine type"
  // Default is f1-micro because it is the cheapest
  default     = "f1-micro"
}

variable "gcp_region" {
  description = "GCP region, e.g. asia-east1"
  default     = "asia-east1"
}

variable "image" {
  description = "image to build instance from in the format: image-family/os. See: https://cloud.google.com/compute/docs/images#os-compute-support"
  default     = "ubuntu-os-pro-cloud/ubuntu-pro-2004-lts"
}

variable "service_account_email" {
    description = "This is the firebase email that you generated, please fill in"
}

// "firebase-adminsdk-i0ldh@gdsc-gateway.iam.gserviceaccount.com"
# variable "nat_ip" {
#     // default = "34.80.101.100"
# }