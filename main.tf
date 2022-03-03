terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "4.11.0"
    }
  }
}
// TODO: Clean up the hardcode field, and adding variable
provider "google" {
 project     = "gdsc-gateway"
 region      = "asia-east1"
 zone = "asia-east1-b"
}

// Terraform plugin for creating random ids
resource "random_id" "instance_id" {
 byte_length = 8
}
// Teraform nameing convetion 
// resourse "provider_resource" "name"
// provider_resoource: is the provider cloud resource that they provide
// name is just a name that ref your resource to your local terraform file
// A single Compute Engine instance
resource "google_compute_instance" "vm_instance" {
 name         = "gateway-vm-${random_id.instance_id.hex}"
 machine_type = "f1-micro"
 zone         = "asia-east1-b"
 tags = ["http-server"]
// Check image using gcloud compute images list
 boot_disk {
   initialize_params {
     image = "ubuntu-os-pro-cloud/ubuntu-pro-2004-lts"
   }  
 }
// Set network 
network_interface {
   network = google_compute_network.vm_instance.name

   access_config {
     // Include this section to give the VM an external ip address
    
   }
 }

// Make sure git, nodejs and our dependencie is installed
metadata_startup_script = file("./startup.sh")

}

// Config firewall to open port for the machine
 resource "google_compute_firewall" "vm_instance" {
  name    = "gateway-vm-firewall"
  direction = "INGRESS"
  network = google_compute_network.vm_instance.name

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports    = ["80","8080", "1883", "3000","22"]

  }
  source_ranges = ["0.0.0.0/0"]
  target_tags = ["http-server"]
}

resource "google_compute_network" "vm_instance" {
  name = "gateway-network"
}
