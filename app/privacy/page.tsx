import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto py-12 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mt-8 mb-4">PRIVACY AND DATA PROTECTION POLICY</h2>
          <p className="mb-4">
            Immi Center is authorized by the Ministry of Tourism through Cadastur to operate with the activity of obtaining and legalizing documents for travelers in accordance with Law 11.771/08 – Art. 27 § 4o I which can be verified at: <a href="https://cadastur.turismo.gov.br/cadastur/#!/public/qrcode/43274527000117" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">Cadastur QR Code</a>. Heliza Giovana Conrado de Andrade Chacha – CNPJ 43.274.527/0001-17. Immi Center ensures the protection, integrity, and confidentiality of the personal data provided by its clients.
          </p>
          <p className="mb-4">
            Our Data Protection Policy is founded on the principle of proactive responsibility, meaning that Immi Center assumes accountability for the proper application of all legal, regulatory, and jurisprudential data protection requirements, and can demonstrate compliance before competent authorities.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-4">Data Controller – Who We Are</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Name:</strong> Immi Center</li>
            <li><strong>Address:</strong> Averrois, 96</li>
            <li><strong>Email:</strong> immiworldcenter@gmail.com</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-4">Purpose of Data Processing – Why We Collect Your Information</h3>
          <p className="mb-4">
            All personal data provided by clients or visitors through the Immi Center website or its staff are included in the company&apos;s personal data processing register, maintained under our responsibility.
          </p>
          <p className="mb-4">
            These data are necessary to deliver the services requested by users or to respond to inquiries and support requests. Immi Center does not engage in user profiling.
          </p>
          <p className="mb-4">
            Data processing performed through this website aims to manage the administrative and documentation process of visa applications requested by the data subject. Accordingly, Immi Center may have access to sensitive data, including medical certificates, health-related information, and criminal record certificates. These data are strictly used for the aforementioned purposes and treated with the utmost confidentiality and security.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-4">Legal Basis – Why We Are Authorized to Process Your Data</h3>
          <p className="mb-4">
            a) <strong>Contractual relationship:</strong> when purchasing a product or hiring a service from Immi Center.
          </p>
          <p className="mb-4">
            b) <strong>Legitimate interest:</strong> for responding to customer inquiries, managing complaints, and collecting pending payments.
          </p>
          <p className="mb-4">
            c) <strong>Consent:</strong> when users voluntarily check the corresponding box on our contact forms, authorizing communication regarding their inquiry or information request.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-4">Data Recipients – Who We Share Your Information With</h3>
          <p className="mb-4">
            Your data may be shared with public or private entities when required by law. For example, fiscal regulations may obligate Immi Center to provide specific economic transaction details to tax authorities.
          </p>
          <p className="mb-4">
            When services are rendered through our online portal, we may also share data with consular offices relevant to your visa or document application.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-4">International Transfers – Where Your Data May Go</h3>
          <p className="mb-4">
            If your application involves documentation from outside the European Economic Area (EEA), your data may be transmitted internationally to the appropriate consular or administrative offices.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-4">Data Retention – How Long We Keep Your Information</h3>
          <p className="mb-4">
            Personal data are retained only for as long as necessary to fulfill the purposes for which they were collected. Retention periods are defined based on legal obligations, contractual requirements, and Immi Center&apos;s legitimate business interests.
          </p>
          <p className="mb-4">
            After the active relationship ends, data are securely blocked and stored only for potential legal obligations, judicial actions, or administrative inquiries. Once blocked, the data are inaccessible to Immi Center and will be made available solely to public authorities or courts if required.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-4">Data Security – How We Protect Your Information</h3>
          <p className="mb-4">
            Immi Center applies advanced technical and organizational measures to safeguard personal data from loss, unauthorized access, misuse, or disclosure. Our staff is trained in data protection practices, and any third parties providing support services must comply with the same security and confidentiality standards.
          </p>
          <p className="mb-4">
            Although we strive to maintain the highest levels of security, users are advised to take appropriate measures to protect their personal information when using online services.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
} 