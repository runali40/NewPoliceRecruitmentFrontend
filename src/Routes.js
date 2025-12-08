import HomePage from './Components/Dashboard/HomePage';
import Login from './Pages/Login/Login';
import Candidate from './Pages/Candidate/Candidate';
import Measurement from './Pages/Candidate/Measurement';
import DocumentVerification from './Pages/Candidate/DocumentVerification';
import Biometric from './Pages/Biometric/Biometric';
import Event from './Pages/Event/Event';
import Event_Form from './Pages/Event/Event_Form';
import ShotputForm from './Pages/Event/ShotputForm';
import AdmissionCard from './Pages/Admission/AdmissionCard';
import AppealForm from './Pages/Admission/AppealForm';
import AdmissionCardRejectForm from './Pages/Admission/AdmissionCardRejectForm';
import GroundTest from './Pages/Event/GroundTest';
import UserMaster from './Pages/Master/UserMaster';
import RoleMasterForm from './Pages/Master/RoleMaster/RoleMasterForm';
import RoleMaster from './Pages/Master/RoleMaster/RoleMaster';
import Configuration from './Pages/Configuration/Configuration';
import DutyMaster from './Pages/Master/DutyMaster/DutyMaster';
import DutyMasterForm from './Pages/Master/DutyMaster/DutyMasterForm';
import ParameterMaster from './Pages/Master/ParameterMaster/ParameterMaster';
import ParameterValueMaster from './Pages/Master/ParameterMaster/ParameterValueMaster';
import Rfid from './Pages/Rfid/Rfid';
import AutoImageScan from './Pages/ImageScan/AutoImageScan';
import ImageScanWithButton from './Pages/ImageScan/ImageScanWithButton';
import TableComponent from './Pages/DataTable';
import AllEvent from './Pages/Event/AllEvent';
import AddEventModal from './Pages/Configuration/ConfigEventModal';
// import AddCategoryPage from './Pages/Configuration/CategoryModal';
import DocumentMaster from './Pages/Master/DocumentMaster/DocumentMaster';
import DocumentMasterForm from './Pages/Master/DocumentMaster/DocumentMasterForm';
import AddCategoryPage from './Pages/Configuration/AddCategoryPage';
import AddEventPage from './Pages/Configuration/AddEventPage';
import DailyReport from './Pages/Report/DailyReport';
import OmrMaster from './Pages/Master/OmrMaster/OmrMaster';
// import OMRUpload from './Pages/OmrUpload/OmrUpload';
import CutOffMaster from './Pages/Master/CutOffMaster/CutOffMaster';
import OMRSheetReader from './Pages/OmrUpload/OmrSheetReader';
import ScanChestNo from './Pages/Rfid/ScanChestNo';
import MeasurementMaster from './Pages/Master/MeasurementMaster/MeasurementMaster';
// import AddEventParameter from './Pages/Configuration/AddEventParameter';
import LanguageSelector from './Pages/Master/LanguageSelector';
import EventMaster from './Pages/Master/EventMaster/EventMaster';
import AddEventParameter from './Pages/Master/EventMaster/AddEventParameter';
import AddEventAccess from './Pages/Configuration/AddEventAccess';
import RfidMaster from './Pages/Master/RfidMaster/RfidMaster';
import RFIDScanner from './Pages/Biometric/RFIDScanner';
import Signature from './Pages/Signature/Signature';
import GroundTest1 from './Pages/Event/GroundTest1';
import GroundTest2 from './Pages/Event/GroundTest2';
import RejectedCandidate from './Pages/Candidate/RejectedCandidate';
import ScheduleMaster from './Pages/Master/ScheduleMaster/ScheduleMaster';
import RFIDScanner2 from './Pages/Biometric/RFIDScanner2';
import OmrUpload1 from './Pages/Master/OmrUpload1/OmrUpload1';
import All100MeterReport from './Pages/Report/All100MeterReport';
import All800MeterReport from './Pages/Report/All800MeterReport';
import All1600MeterReport from './Pages/Report/All1600MeterReport';
import ShotputReport from './Pages/Report/ShotputReport';
import AllRunningReport from './Pages/Report/AllRunningReport';

const routes = [
    { path: '/', exact: true, name: 'Login', element: Login },
    { path: '/', exact: true, name: 'HomePage', element: HomePage },
    { path: '/dashboard', exact: true, name: 'Dashboard', element: HomePage },
    { path: '/candidate', name: 'Candidate', element: Candidate },
    { path: '/candidate/:CandidateId', name: 'Candidate', element: Candidate },
    { path: '/rejectedCandidate', name: 'Rejected Candidate', element: RejectedCandidate },
    { path: '/documentVerification', name: 'Document Verification', element: DocumentVerification },
    { path: '/measurement', name: 'Measurement', element: Measurement },
    { path: '/event/:pid/:id', name: 'Event', element: Event },
    { path: '/event_form', name: 'Event_100_Form', element: Event_Form },
    { path: '/biometric', name: 'Biometric', element: Biometric },
    { path: '/shotputForm', name: 'ShotputForm', element: ShotputForm },
    { path: '/admissionCard', name: 'Admission Card', element: AdmissionCard },
    { path: '/appeal', name: 'Appeal', element: AppealForm },
    { path: '/admissioncardreject', name: 'Admission Card Reject', element: AdmissionCardRejectForm },
    // { path: '/groundTest', name: 'Ground Test', element: GroundTest },
    { path: '/groundTest1', name: 'Ground Test1', element: GroundTest1 },
    { path: '/groundTest', name: 'Ground Test2', element: GroundTest2 },
    { path: '/userMaster', name: 'User Master', element: UserMaster },
    { path: '/roleMaster', name: 'Role Master', element: RoleMaster },
    { path: '/roleMasterForm', name: 'Role Master Form', element: RoleMasterForm },
    { path: '/dutyMaster', name: 'Duty Master', element: DutyMaster },
    { path: '/dutyMasterForm', name: 'Duty Master Form', element: DutyMasterForm },
    { path: '/documentMaster', name: 'Document Master', element: DocumentMaster },
    { path: '/documentMasterForm', name: 'Document Master Form', element: DocumentMasterForm },
    { path: '/configuration', name: 'Recruitment', element: Configuration },
    { path: '/addEventModal', name: 'AddEventModal', element: AddEventModal },
    { path: '/parameterMaster', name: 'Parameter Master', element: ParameterMaster },
    { path: '/parameterValueMaster', name: 'Parameter Value Master', element: ParameterValueMaster },
    { path: '/rfidMapping', name: 'Rfid Mapping', element: Rfid },
    { path: '/imageScanWithButton', name: 'ImageScanWithButton', element: ImageScanWithButton },
    { path: '/autoImageScan', name: 'AutoImageScan', element: AutoImageScan },
    { path: '/dataTable', name: 'DataTable', element: TableComponent },
    { path: '/allEvent', name: 'AllEvent', element: AllEvent },
    { path: '/addCategoryPage', name: 'Add Category', element: AddCategoryPage },
    { path: '/addEventPage', name: 'Add Event', element: AddEventPage },
    { path: '/dailyReport', name: 'Daily Report', element: DailyReport },
    { path: '/omrMaster', name: 'OMR Master', element: OmrMaster },
    // { path: '/omrUpload', name: 'OmrUpload' , element:OMRUpload},
    { path: '/cutOffMaster', name: 'CutOffMaster', element: CutOffMaster },
    { path: '/omrSheetReader', name: 'OmrSheetReader', element: OMRSheetReader },
    { path: '/scanChestNo', name: 'ScanChestNo', element: ScanChestNo },
    { path: '/measurementMaster', name: 'Measurement Master', element: MeasurementMaster },
    { path: '/addEventParameter', name: 'AddEventParameter', element: AddEventParameter },
    { path: '/languageSelector', name: 'Language Selector', element: LanguageSelector },
    { path: '/eventMaster', name: 'Event Master', element: EventMaster },
    { path: '/addEventAccess', name: 'Add Event Access', element: AddEventAccess },
    { path: '/rfidMaster', name: 'Rfid Master', element: RfidMaster },
    { path: '/rfidScanner', name: 'Rfid Scanner', element: RFIDScanner },
    { path: '/rfidScanner2', name: 'Rfid Scanner', element: RFIDScanner2 },
    { path: '/signature', name: 'Signature', element: Signature },
    { path: '/scheduleMaster', name: 'ScheduleMaster', element: ScheduleMaster },
    { path: '/omrUpload1', name: 'OmrUpload1', element: OmrUpload1 },
    // { path: '/100MeterReport/:pid/:id', name: '100 Meter Report', element: All100MeterReport },
    { path: '/100MeterReport', name: '100 Meter Report', element: All100MeterReport },
    { path: '/800MeterReport', name: '800 Meter Report', element: All800MeterReport },
    { path: '/1600MeterReport', name: '1600 Meter Report', element: All1600MeterReport },
    { path: '/shotputReport', name: 'Shot Put Report', element: ShotputReport },
    { path: '/allRunningReport', name: 'All Running Report', element: AllRunningReport },
]
export default routes