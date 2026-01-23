pub mod history;
pub mod quarantine;
pub mod scan;
pub mod log;

pub fn new_id() -> String {
    uuid::Uuid::new_v4().to_string()
}