// TODO: Clean up the hardcode field, and adding variable
// TODO: Automatic create FireStore and add its service_account to this project 
// TODO:

provider "google" {
  project = var.project_id
  region  = var.gcp_region
  zone    = var.zone_name
}

// Terraform plugin for creating random ids
resource "random_id" "instance_id" {
  byte_length = 8
}

// Teraform nameing convetion 
// resourse "provider_resource" "name"
// provider_resource: is the provider cloud resource that they provide
// name is just a name that ref your resource to your local terraform file
// A single Compute Engine instance

resource "google_compute_instance" "vm_instance" {
  name         = "gateway-vm-${random_id.instance_id.hex}"
  machine_type = var.machine_type
  zone         = var.zone_name
  tags         = ["http-server"]
  // Check image using gcloud compute images list
  boot_disk {
    initialize_params {
      image = var.image
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
  service_account {
    email = var.service_account_email 
    scopes = 
  }
}


// Config firewall to open port for the machine
resource "google_compute_firewall" "vm_instance" {
  name      = "gateway-vm-firewall"
  direction = "INGRESS"
  network   = google_compute_network.vm_instance.name

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports    = ["80", "8080", "1883", "3000", "22","443"]

  }
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]
}

resource "google_compute_network" "vm_instance" {
  name = "gateway-network"
}
