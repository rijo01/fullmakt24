#!/usr/bin/env python3
"""
Generates 100 new fullmakt templates (id 137-236) and writes:
- TS template push() blocks into data/templates.ts (before the defensive dedup)
- public/content/mallar/{slug}.json (full Template object)
- content/mallar/{slug}.json (SeoContent object)
"""
import json
import os
import re
from pathlib import Path
from textwrap import dedent

ROOT = Path(__file__).resolve().parent.parent
TEMPLATES_TS = ROOT / 'data' / 'templates.ts'
PUBLIC_DIR = ROOT / 'public' / 'content' / 'mallar'
CONTENT_DIR = ROOT / 'content' / 'mallar'

PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
CONTENT_DIR.mkdir(parents=True, exist_ok=True)

CATEGORIES = {
    'foraldrar-barn': 'Föräldrar & Barn',
    'resa-transport': 'Resa & Transport',
    'vard-omsorg': 'Vård & Omsorg',
    'ekonomi-myndigheter': 'Ekonomi, Bank & Myndigheter',
    'boende-vardag': 'Boende & Vardag',
    'forening-skola': 'Förening, Skola & Fritid',
    'djur-husdjur': 'Djur & Husdjur',
    'seniorer-omsorg': 'Seniorer & Digital Omsorg',
    'digitalt-dodsbo': 'Digitalt & Dödsbo',
}

# Field archetypes
def standard_fields():
    return [
        {'id': 'fullmaktsgivare_namn', 'label': 'Fullmaktsgivarens fullständiga namn', 'type': 'text', 'placeholder': 'Anna Svensson', 'required': True, 'group': 'givare'},
        {'id': 'fullmaktsgivare_pnr', 'label': 'Personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'givare'},
        {'id': 'fullmaktsgivare_adress', 'label': 'Adress', 'type': 'address', 'placeholder': 'Gatuadress, postnummer, ort', 'required': True, 'group': 'givare'},
        {'id': 'ombud_namn', 'label': 'Ombudets fullständiga namn', 'type': 'text', 'placeholder': 'Erik Svensson', 'required': True, 'group': 'havare'},
        {'id': 'ombud_pnr', 'label': 'Ombudets personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'havare'},
        {'id': 'ombud_relation', 'label': 'Relation till fullmaktsgivaren', 'type': 'text', 'placeholder': 'T.ex. make/maka, barn, vän', 'required': False, 'group': 'havare'},
        {'id': 'uppdrag', 'label': 'Specifikt uppdrag', 'type': 'textarea', 'placeholder': 'Beskriv vad fullmakten omfattar...', 'required': True, 'group': 'detaljer'},
        {'id': 'giltighetstid', 'label': 'Giltighetstid', 'type': 'select', 'options': ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], 'required': True, 'group': 'detaljer'},
    ]

def company_fields():
    return [
        {'id': 'foretag_namn', 'label': 'Företagets namn', 'type': 'text', 'placeholder': 'Exempel AB', 'required': True, 'group': 'givare'},
        {'id': 'orgnr', 'label': 'Organisationsnummer', 'type': 'text', 'placeholder': '556677-1122', 'required': True, 'group': 'givare'},
        {'id': 'foretradare_namn', 'label': 'Behörig företrädares namn', 'type': 'text', 'placeholder': 'Anna Svensson', 'required': True, 'group': 'givare'},
        {'id': 'foretradare_pnr', 'label': 'Företrädarens personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'givare'},
        {'id': 'foretradare_roll', 'label': 'Roll i bolaget', 'type': 'select', 'options': ['VD', 'Styrelseledamot', 'Ordförande', 'Firmatecknare', 'Prokurist'], 'required': True, 'group': 'givare'},
        {'id': 'ombud_namn', 'label': 'Ombudets fullständiga namn', 'type': 'text', 'placeholder': 'Erik Svensson', 'required': True, 'group': 'havare'},
        {'id': 'ombud_pnr', 'label': 'Ombudets personnummer/orgnr', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'havare'},
        {'id': 'befogenheter', 'label': 'Befogenheter', 'type': 'textarea', 'placeholder': 'Specificera vilka rättshandlingar ombudet får utföra...', 'required': True, 'group': 'detaljer'},
        {'id': 'giltighetstid', 'label': 'Giltighetstid', 'type': 'select', 'options': ['3 månader', '6 månader', '1 år', '2 år', 'Tillsvidare'], 'required': True, 'group': 'detaljer'},
    ]

def realestate_fields():
    return [
        {'id': 'agare_namn', 'label': 'Fastighetsägarens namn', 'type': 'text', 'placeholder': 'Anna Svensson', 'required': True, 'group': 'givare'},
        {'id': 'agare_pnr', 'label': 'Personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'givare'},
        {'id': 'fastighetsbeteckning', 'label': 'Fastighetsbeteckning', 'type': 'text', 'placeholder': 'T.ex. Stockholm Vasastaden 1:23', 'required': True, 'group': 'detaljer'},
        {'id': 'fastighet_adress', 'label': 'Fastighetens adress', 'type': 'address', 'placeholder': 'Gatuadress, ort', 'required': True, 'group': 'detaljer'},
        {'id': 'ombud_namn', 'label': 'Ombudets fullständiga namn', 'type': 'text', 'placeholder': 'Erik Svensson', 'required': True, 'group': 'havare'},
        {'id': 'ombud_pnr', 'label': 'Ombudets personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'havare'},
        {'id': 'uppdrag', 'label': 'Uppdragets art', 'type': 'textarea', 'placeholder': 'Beskriv uppdraget – t.ex. försäljning, lagfart, inteckning...', 'required': True, 'group': 'detaljer'},
        {'id': 'min_pris', 'label': 'Lägsta accepterade pris (om relevant)', 'type': 'text', 'placeholder': 'T.ex. 4 500 000 kr', 'required': False, 'group': 'detaljer'},
        {'id': 'giltighetstid', 'label': 'Giltighetstid', 'type': 'select', 'options': ['3 månader', '6 månader', '1 år', 'Till uppdrag slutfört'], 'required': True, 'group': 'detaljer'},
    ]

def vehicle_fields():
    return [
        {'id': 'agare_namn', 'label': 'Fordonsägarens namn', 'type': 'text', 'placeholder': 'Anna Svensson', 'required': True, 'group': 'givare'},
        {'id': 'agare_pnr', 'label': 'Personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'givare'},
        {'id': 'regnr', 'label': 'Registreringsnummer', 'type': 'text', 'placeholder': 'ABC 123', 'required': True, 'group': 'detaljer'},
        {'id': 'fordon_beskrivning', 'label': 'Fordonsmodell och årsmodell', 'type': 'text', 'placeholder': 'T.ex. Volvo XC60 2020', 'required': True, 'group': 'detaljer'},
        {'id': 'ombud_namn', 'label': 'Ombudets fullständiga namn', 'type': 'text', 'placeholder': 'Erik Svensson', 'required': True, 'group': 'havare'},
        {'id': 'ombud_pnr', 'label': 'Ombudets personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'havare'},
        {'id': 'uppdrag', 'label': 'Uppdragets art', 'type': 'select', 'options': ['Försäljning och ägarbyte', 'Registrering', 'Avregistrering', 'Besiktning', 'Alla fordonsärenden'], 'required': True, 'group': 'detaljer'},
        {'id': 'min_pris', 'label': 'Lägsta pris vid försäljning (om relevant)', 'type': 'text', 'placeholder': 'T.ex. 75 000 kr', 'required': False, 'group': 'detaljer'},
        {'id': 'giltighetstid', 'label': 'Giltighetstid', 'type': 'select', 'options': ['1 månad', '3 månader', '6 månader', '1 år', 'Tills uppdrag slutfört'], 'required': True, 'group': 'detaljer'},
    ]

def medical_fields():
    return [
        {'id': 'patient_namn', 'label': 'Patientens fullständiga namn', 'type': 'text', 'placeholder': 'Anna Svensson', 'required': True, 'group': 'givare'},
        {'id': 'patient_pnr', 'label': 'Patientens personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'givare'},
        {'id': 'patient_adress', 'label': 'Patientens adress', 'type': 'address', 'placeholder': 'Gatuadress, ort', 'required': True, 'group': 'givare'},
        {'id': 'ombud_namn', 'label': 'Ombudets fullständiga namn', 'type': 'text', 'placeholder': 'Erik Svensson', 'required': True, 'group': 'havare'},
        {'id': 'ombud_pnr', 'label': 'Ombudets personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'havare'},
        {'id': 'ombud_relation', 'label': 'Relation till patienten', 'type': 'text', 'placeholder': 'T.ex. make/maka, barn, vårdnadshavare', 'required': True, 'group': 'havare'},
        {'id': 'vardgivare', 'label': 'Vårdgivare (om specifik)', 'type': 'text', 'placeholder': 'T.ex. Karolinska Universitetssjukhuset', 'required': False, 'group': 'detaljer'},
        {'id': 'behandling', 'label': 'Specifik behandling/ärende', 'type': 'textarea', 'placeholder': 'Beskriv vad medgivandet/fullmakten gäller...', 'required': True, 'group': 'detaljer'},
        {'id': 'giltighetstid', 'label': 'Giltighetstid', 'type': 'select', 'options': ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], 'required': True, 'group': 'detaljer'},
    ]

def child_fields():
    return [
        {'id': 'barn_namn', 'label': 'Barnets fullständiga namn', 'type': 'text', 'placeholder': 'Maja Svensson', 'required': True, 'group': 'givare'},
        {'id': 'barn_pnr', 'label': 'Barnets personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'givare'},
        {'id': 'vh1_namn', 'label': 'Vårdnadshavare 1 (namn)', 'type': 'text', 'placeholder': 'Anna Svensson', 'required': True, 'group': 'givare'},
        {'id': 'vh1_pnr', 'label': 'Vårdnadshavare 1 (personnummer)', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'givare'},
        {'id': 'vh2_namn', 'label': 'Vårdnadshavare 2 (om gemensam vårdnad)', 'type': 'text', 'placeholder': 'Erik Svensson', 'required': False, 'group': 'givare'},
        {'id': 'vh2_pnr', 'label': 'Vårdnadshavare 2 (personnummer)', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': False, 'group': 'givare'},
        {'id': 'ombud_namn', 'label': 'Ombudets/utförarens namn', 'type': 'text', 'placeholder': 'T.ex. mor- eller farförälder, läkare', 'required': True, 'group': 'havare'},
        {'id': 'ombud_pnr', 'label': 'Ombudets personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': False, 'group': 'havare'},
        {'id': 'syfte', 'label': 'Syfte/specifikt uppdrag', 'type': 'textarea', 'placeholder': 'Beskriv ändamålet...', 'required': True, 'group': 'detaljer'},
        {'id': 'giltighetstid', 'label': 'Giltighetstid', 'type': 'select', 'options': ['1 vecka', '1 månad', '3 månader', '6 månader', '1 år'], 'required': True, 'group': 'detaljer'},
    ]

def financial_fields():
    return [
        {'id': 'fullmaktsgivare_namn', 'label': 'Fullmaktsgivarens namn', 'type': 'text', 'placeholder': 'Anna Svensson', 'required': True, 'group': 'givare'},
        {'id': 'fullmaktsgivare_pnr', 'label': 'Personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'givare'},
        {'id': 'ombud_namn', 'label': 'Ombudets fullständiga namn', 'type': 'text', 'placeholder': 'Erik Svensson eller Rådgivare AB', 'required': True, 'group': 'havare'},
        {'id': 'ombud_pnr', 'label': 'Ombudets personnummer/orgnr', 'type': 'text', 'placeholder': 'ÅÅMMDD-XXXX eller XXXXXX-XXXX', 'required': True, 'group': 'havare'},
        {'id': 'institution', 'label': 'Berörd bank/institution', 'type': 'text', 'placeholder': 'T.ex. Avanza, SEB, Handelsbanken', 'required': True, 'group': 'detaljer'},
        {'id': 'befogenheter', 'label': 'Befogenheter', 'type': 'textarea', 'placeholder': 'Beskriv vilka transaktioner och ärenden som ingår...', 'required': True, 'group': 'detaljer'},
        {'id': 'maxbelopp', 'label': 'Max engångsbelopp (om begränsning önskas)', 'type': 'text', 'placeholder': 'T.ex. 100 000 kr eller "Obegränsat"', 'required': False, 'group': 'detaljer'},
        {'id': 'giltighetstid', 'label': 'Giltighetstid', 'type': 'select', 'options': ['1 månad', '3 månader', '6 månader', '1 år', 'Tillsvidare'], 'required': True, 'group': 'detaljer'},
    ]

def digital_fields():
    return [
        {'id': 'kontoinnehavare_namn', 'label': 'Kontoinnehavarens namn', 'type': 'text', 'placeholder': 'Anna Svensson', 'required': True, 'group': 'givare'},
        {'id': 'kontoinnehavare_pnr', 'label': 'Personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'givare'},
        {'id': 'kontoinnehavare_epost', 'label': 'E-postadress (kopplad till tjänsten)', 'type': 'email', 'placeholder': 'anna@exempel.se', 'required': True, 'group': 'givare'},
        {'id': 'ombud_namn', 'label': 'Ombudets fullständiga namn', 'type': 'text', 'placeholder': 'Erik Svensson', 'required': True, 'group': 'havare'},
        {'id': 'ombud_pnr', 'label': 'Ombudets personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'havare'},
        {'id': 'ombud_relation', 'label': 'Relation till kontoinnehavaren', 'type': 'text', 'placeholder': 'T.ex. make/maka, arvinge, barn', 'required': True, 'group': 'havare'},
        {'id': 'tjanst', 'label': 'Digital tjänst', 'type': 'text', 'placeholder': 'T.ex. Google, Apple, Spotify, Microsoft', 'required': True, 'group': 'detaljer'},
        {'id': 'syfte', 'label': 'Vad ska göras med kontot', 'type': 'textarea', 'placeholder': 'T.ex. avsluta, övertaga, ladda ner data...', 'required': True, 'group': 'detaljer'},
        {'id': 'giltighetstid', 'label': 'Giltighetstid', 'type': 'select', 'options': ['1 månad', '3 månader', '6 månader', '1 år'], 'required': True, 'group': 'detaljer'},
    ]

def international_fields():
    return [
        {'id': 'fullmaktsgivare_namn', 'label': 'Fullmaktsgivarens namn', 'type': 'text', 'placeholder': 'Anna Svensson', 'required': True, 'group': 'givare'},
        {'id': 'fullmaktsgivare_pnr', 'label': 'Personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'givare'},
        {'id': 'fullmaktsgivare_pass', 'label': 'Passnummer', 'type': 'text', 'placeholder': '12345678', 'required': False, 'group': 'givare'},
        {'id': 'ombud_namn', 'label': 'Ombudets fullständiga namn', 'type': 'text', 'placeholder': 'Erik Svensson', 'required': True, 'group': 'havare'},
        {'id': 'ombud_pnr', 'label': 'Ombudets personnummer eller utländskt ID', 'type': 'text', 'placeholder': 'ÅÅMMDD-XXXX eller utländskt ID-nummer', 'required': True, 'group': 'havare'},
        {'id': 'land', 'label': 'Berört land', 'type': 'text', 'placeholder': 'T.ex. Spanien, Tyskland, USA', 'required': True, 'group': 'detaljer'},
        {'id': 'myndighet', 'label': 'Berörd myndighet eller dokument', 'type': 'text', 'placeholder': 'T.ex. Apostille, Konsulat, Notarius Publicus', 'required': True, 'group': 'detaljer'},
        {'id': 'uppdrag', 'label': 'Detaljerat uppdrag', 'type': 'textarea', 'placeholder': 'Beskriv vad fullmakten avser...', 'required': True, 'group': 'detaljer'},
        {'id': 'giltighetstid', 'label': 'Giltighetstid', 'type': 'select', 'options': ['1 månad', '3 månader', '6 månader', '1 år'], 'required': True, 'group': 'detaljer'},
    ]

def estate_fields():
    return [
        {'id': 'avliden_namn', 'label': 'Den avlidnes namn (om relevant)', 'type': 'text', 'placeholder': 'Anna Svensson', 'required': False, 'group': 'givare'},
        {'id': 'avliden_pnr', 'label': 'Avlidens personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': False, 'group': 'givare'},
        {'id': 'utstallare_namn', 'label': 'Utställarens namn', 'type': 'text', 'placeholder': 'Anna Svensson', 'required': True, 'group': 'givare'},
        {'id': 'utstallare_pnr', 'label': 'Utställarens personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'givare'},
        {'id': 'ombud_namn', 'label': 'Utseddes namn', 'type': 'text', 'placeholder': 'Erik Svensson', 'required': True, 'group': 'havare'},
        {'id': 'ombud_pnr', 'label': 'Utseddes personnummer', 'type': 'personnummer', 'placeholder': 'ÅÅMMDD-XXXX', 'required': True, 'group': 'havare'},
        {'id': 'ombud_relation', 'label': 'Relation', 'type': 'text', 'placeholder': 'T.ex. barn, vän, advokat', 'required': True, 'group': 'havare'},
        {'id': 'uppdrag', 'label': 'Detaljerat uppdrag', 'type': 'textarea', 'placeholder': 'Beskriv ansvarsområden och uppdragets omfattning...', 'required': True, 'group': 'detaljer'},
        {'id': 'giltighetstid', 'label': 'Giltighetstid', 'type': 'select', 'options': ['6 månader', '1 år', '2 år', 'Tills arvskifte slutfört', 'Tillsvidare'], 'required': True, 'group': 'detaljer'},
    ]

ARCHETYPE_FIELDS = {
    'standard': standard_fields,
    'company': company_fields,
    'realestate': realestate_fields,
    'vehicle': vehicle_fields,
    'medical': medical_fields,
    'child': child_fields,
    'financial': financial_fields,
    'digital': digital_fields,
    'international': international_fields,
    'estate': estate_fields,
}

# Default FAQs per archetype – overridden by template-specific FAQs
ARCHETYPE_FAQS = {
    'standard': [
        ('Måste fullmakten bevittnas?', 'Det är inte ett lagkrav men rekommenderas starkt. Två vittnen som inte är jäviga gör fullmakten lättare att få godkänd av motparten.'),
        ('Hur återkallar jag fullmakten?', 'Meddela fullmaktshavaren skriftligt och informera berörda parter (bank, myndighet etc.). Fullmakten upphör omedelbart.'),
        ('Vad händer vid dödsfall?', 'En vanlig fullmakt upphör automatiskt vid fullmaktsgivarens dödsfall. Dödsboet hanteras sedan av dödsbodelägarna.'),
        ('Kan ombudet ge fullmakten vidare?', 'Bara om det uttryckligen anges. Som standard har ombudet inte rätt att utse en annan person (substitution).'),
        ('Behöver fullmakten registreras?', 'Nej, en vanlig fullmakt registreras inte. Den ska däremot visas upp i original eller bevittnad kopia när ombudet agerar.'),
    ],
    'company': [
        ('Vem får utfärda fullmakt för ett aktiebolag?', 'Endast styrelseledamot, VD eller annan firmatecknare har rätt att utfärda fullmakt för bolagets räkning.'),
        ('Behöver fullmakten registreras hos Bolagsverket?', 'Generellt inte, men vissa typer av fullmakter (t.ex. prokura) ska registreras enligt prokuralagen.'),
        ('Kan fullmakten gälla flera år?', 'Ja. Företagsfullmakter gäller ofta tillsvidare eller flera år. Specificera dock alltid en tidsgräns för säkerhets skull.'),
        ('Hur återkallas en företagsfullmakt?', 'Beslut om återkallelse fattas av samma organ som utfärdade fullmakten. Skriftlig återkallelse skickas till ombudet och berörda parter.'),
        ('Gäller fullmakten vid VD-byte?', 'Det beror på fullmaktens utformning. Om fullmakten utfärdats av bolaget (inte personligen av VD) gäller den vidare efter VD-byte.'),
    ],
    'realestate': [
        ('Krävs bevittning för fastighetsfullmakt?', 'Vid försäljning av fast egendom krävs två vittnen och notariell bekräftelse enligt jordabalken (JB 4 kap. 3 §).'),
        ('Kan ombudet skriva under köpekontrakt?', 'Ja, om fullmakten specifikt anger detta och är korrekt bevittnad. Banker och Lantmäteriet kan ställa egna krav.'),
        ('Hur länge gäller fastighetsfullmakten?', 'Den kan gälla en bestämd tid eller tills uppdraget är slutfört. För säkerhet rekommenderas en uttrycklig tidsgräns.'),
        ('Vad händer om priset blir lägre än önskat?', 'Ange ett minimipris i fullmakten. Ombudet kan inte gå under utan ditt godkännande – annars handlar de utanför fullmakten.'),
        ('Behöver fullmakten lagföras?', 'Lantmäteriet kräver ofta att fullmakten lämnas in i original eller som styrkt kopia vid registreringsärenden.'),
    ],
    'vehicle': [
        ('Var anmäls ägarbyte?', 'Hos Transportstyrelsen via deras e-tjänst eller via post. Ägarbyte ska anmälas inom 10 dagar från övergången.'),
        ('Behöver fordonsfullmakten bevittnas?', 'Inte enligt lag, men det rekommenderas. Köparen och Transportstyrelsen kan kräva det.'),
        ('Kan ombudet sälja fordonet under marknadsvärde?', 'Bara om du tillåter det. Ange ett minimipris i fullmakten för att skydda dig.'),
        ('Vad behövs vid besiktning?', 'Fullmakten i original, ombudets ID-handling samt fordonets registreringsbevis del 2.'),
        ('Gäller fullmakten för export utomlands?', 'Vid export krävs ofta separat exportfullmakt och tullhandlingar. Kontakta Transportstyrelsen och Tullverket.'),
    ],
    'medical': [
        ('Accepterar svensk vård ombud?', 'Ja, svenska vårdgivare är skyldiga att respektera giltiga fullmakter enligt patientlagen (2014:821).'),
        ('Kan ombudet fatta medicinska beslut?', 'Endast om patienten saknar beslutsförmåga och fullmakten uttryckligen ger denna rätt. Annars krävs patientens samtycke.'),
        ('Får ombudet ta del av journalen?', 'Ja, om det anges i fullmakten. Vårdgivaren bedömer i varje enskilt fall enligt patientdatalagen (2008:355).'),
        ('Behöver fullmakten bevittnas?', 'Rekommenderas starkt vid känsliga uppgifter eller större ingrepp. Bevittning ger fullmakten extra juridisk tyngd.'),
        ('Vad är skillnaden mot en framtidsfullmakt?', 'En vanlig fullmakt gäller medan du är beslutskompetent. Framtidsfullmakten träder i kraft först när du inte längre kan fatta beslut.'),
    ],
    'child': [
        ('Krävs båda vårdnadshavares underskrift?', 'Vid gemensam vårdnad krävs båda vårdnadshavares samtycke för väsentliga beslut. För vardagliga beslut räcker en.'),
        ('Hur länge gäller medgivandet?', 'Under den tid du anger. Vi rekommenderar att specificera ett konkret slutdatum för säkerhet.'),
        ('Kan medgivandet återkallas?', 'Ja, när som helst. Meddela mottagaren och berörda parter skriftligt så slutar medgivandet att gälla omedelbart.'),
        ('Behöver medgivandet bevittnas?', 'Inte enligt lag, men många mottagare (skolor, vårdgivare) föredrar det. Två vittnen rekommenderas.'),
        ('Vad om vårdnadshavarna är osams?', 'Vid oenighet kan saken avgöras av tingsrätten. Familjerätten kan också medla via socialnämnden.'),
    ],
    'financial': [
        ('Accepterar alla banker fullmakten?', 'De flesta banker accepterar en korrekt utformad fullmakt, men vissa har egna blanketter. Kontakta banken i förväg.'),
        ('Kan ombudet ta lån i mitt namn?', 'Bara om fullmakten uttryckligen anger detta. Lånebeslut är ofta personliga och kräver din uttryckliga rätt.'),
        ('Hur skyddas jag mot missbruk?', 'Ange tydliga begränsningar, max-belopp och giltighetstid. Återkalla fullmakten när uppdraget är slutfört.'),
        ('Måste bankfullmakten bevittnas?', 'Inte enligt lag, men många banker kräver eller starkt rekommenderar två vittnen.'),
        ('Gäller fullmakten utomlands?', 'Den gäller primärt i Sverige. För utlandsbruk kan apostille eller legalisering krävas.'),
    ],
    'digital': [
        ('Accepterar Google eller Apple svenska fullmakter?', 'Internationella tjänster har egna processer. Fullmakten är ett komplement – men de kan kräva engelsk översättning och dödsfallsintyg.'),
        ('Vad händer med en avliden persons konto?', 'Många tjänster erbjuder en "legacy"-process. Fullmakt och dödsfallsintyg krävs ofta. Vissa konton raderas automatiskt efter inaktivitet.'),
        ('Kan jag ge ombud rätt att se min mejl?', 'Ja, om det anges i fullmakten. Notera att tjänsteleverantörens egna regler också gäller och kan kräva extra verifiering.'),
        ('Behövs översättning?', 'För utländska tjänster: ja, en auktoriserad översättning till engelska rekommenderas starkt.'),
        ('Hur lång tid tar det att avsluta ett digitalt konto?', 'Från några dagar till flera månader beroende på leverantör. Google har en särskild "Inactive Account Manager"-process.'),
    ],
    'international': [
        ('Vad är en apostille?', 'En apostille är ett intyg från Notarius Publicus som bekräftar att en svensk myndighets eller notaries underskrift är äkta. Krävs för många utländska myndigheter.'),
        ('Var ansöker jag om apostille?', 'Hos Notarius Publicus i Sverige. Listan finns på regeringen.se. Avgift tas ut per dokument.'),
        ('Behöver fullmakten översättas?', 'Ja, oftast krävs auktoriserad översättning till mottagarlandets språk eller engelska.'),
        ('Vad är skillnaden mellan apostille och legalisering?', 'Apostille gäller för länder som undertecknat Haagkonventionen (1961). För andra länder krävs legalisering via UD och landets ambassad.'),
        ('Kan svensk fullmakt användas direkt utomlands?', 'Ibland, men oftast krävs apostille eller legalisering plus översättning. Kontakta landets ambassad i förväg.'),
    ],
    'estate': [
        ('Vem kan utses till testamentsexekutor?', 'En myndig och rättskapabel person, ofta en familjemedlem, advokat eller revisor. Personen ska kunna ta uppdraget utan jävsproblem.'),
        ('Måste bouppteckning göras?', 'Ja, vid varje dödsfall ska bouppteckning upprättas inom 3 månader och lämnas till Skatteverket inom 4 månader.'),
        ('Vem är dödsbodelägare?', 'Make/maka, sambo med gemensamma barn, barn (bröstarvingar) och eventuella testamentstagare. Universella testamentstagare räknas också in.'),
        ('Kan jag bestämma min egen begravning?', 'Ja, genom skriftliga önskemål i förväg. Det är inte bindande men respekteras vanligtvis av anhöriga.'),
        ('Hur länge gäller fullmakt för dödsboet?', 'Vanligen tills arvskiftet är slutfört och dödsboet upplöst.'),
    ],
}

# Generic legalInfo per archetype
ARCHETYPE_LEGAL = {
    'standard': 'Regleras av avtalslagen (1915:218). Fullmakten upphör vid återkallelse eller dödsfall.',
    'company': 'Regleras av aktiebolagslagen (2005:551) och prokuralagen (1974:158). Behörig företrädare ska utfärda fullmakten.',
    'realestate': 'Jordabalken (JB 4 kap. 3 §) reglerar fastighetsförsäljning – kräver bevittning och notariell bekräftelse.',
    'vehicle': 'Transportstyrelsen reglerar ägarbyte och registrering. Fullmakten kompletterar formell anmälan.',
    'medical': 'Regleras av patientlagen (2014:821) och patientdatalagen (2008:355).',
    'child': 'Föräldrabalken (1949:381) reglerar vårdnadshavares rättigheter och skyldigheter.',
    'financial': 'Avtalslagen (1915:218) reglerar fullmakter. Banker och finansinstitut kan ha egna krav.',
    'digital': 'Saknar enhetlig svensk reglering. Tjänsteleverantörers villkor och internationella riktlinjer gäller parallellt.',
    'international': 'Haagkonventionen (1961) om apostille gäller mellan medlemsländer. Notarius Publicus utfärdar apostille i Sverige.',
    'estate': 'Ärvdabalken (1958:637) reglerar dödsbo, arv och testamente.',
}

# ─── 100 templates ───
# (slug, name, cat_slug, description, longDescription, badge, usage, archetype, specific_legalInfo (optional, else default), keywords, related_offsets, faqs (optional list of (q,a) tuples; falls back to archetype default))
T = []

# === FÖRETAG & JURIDIK (12) → ekonomi-myndigheter ===
T.append(('fullmakt-firmateckning-ensam', 'Fullmakt firmateckning ensam', 'ekonomi-myndigheter',
    'Fullmakt för en person att teckna firma ensam för aktiebolaget.',
    'Med denna fullmakt får ombudet rätt att ensam teckna firma för bolagets räkning – t.ex. underteckna avtal, betalningar och officiella handlingar. Lämplig när VD eller styrelseledamot inte är tillgänglig.',
    'premium', 4520, 'company', None,
    ['firmateckning', 'fullmakt företag', 'firmateckningsrätt', 'aktiebolag fullmakt', 'fullmakt VD'],
    [1, 2, 7], None))

T.append(('fullmakt-firmateckning-gemensam', 'Fullmakt firmateckning i förening', 'ekonomi-myndigheter',
    'Fullmakt för två eller flera personer att gemensamt teckna firma.',
    'Ger två eller fler personer rätt att teckna firma i förening – alla angivna ombud måste underteckna gemensamt för att rättshandlingen ska vara giltig. Standard vid större affärer.',
    'premium', 3780, 'company', None,
    ['firmateckning gemensam', 'firmateckning i förening', 'fullmakt aktiebolag', 'fullmakt företag'],
    [0, 2, 7], None))

T.append(('fullmakt-bolagsstamma', 'Fullmakt till bolagsstämma', 'ekonomi-myndigheter',
    'Fullmakt för ombud att rösta åt aktieägare vid bolagsstämma.',
    'Ger ombudet rätt att rösta för dina aktier vid årsstämma eller extra bolagsstämma. Du kan ge ombudet fria händer eller specifika röstinstruktioner per punkt.',
    'popular', 8920, 'standard', 'Regleras av aktiebolagslagen (2005:551) 7 kap. om bolagsstämma och rösträtt.',
    ['fullmakt bolagsstämma', 'fullmakt aktieägare', 'årsstämma fullmakt', 'rösta för aktier'],
    [0, 1, 6], [
        ('Måste fullmakten visas upp på stämman?', 'Ja, ombudet ska visa original eller styrkt kopia av fullmakten samt giltig ID-handling vid inregistreringen.'),
        ('Kan ombudet rösta som det vill?', 'Ja, om du inte angett röstningsinstruktioner. För att skydda dina intressen kan du specificera röstning per punkt.'),
        ('Behöver fullmakten bevittnas?', 'Aktiebolagslagen kräver det inte, men många bolagsordningar gör det. Kontrollera bolagets stadgar.'),
        ('Hur länge gäller stämmofullmakten?', 'Som regel max ett år från utfärdandet. Bolagsordningen kan ange annat.'),
        ('Kan ett ombud representera flera aktieägare?', 'Ja, det är vanligt med samlade ombud (depåförvaltare) som röstar för många aktieägare.'),
    ]))

T.append(('fullmakt-revisor', 'Fullmakt till revisor', 'ekonomi-myndigheter',
    'Fullmakt för revisor att företräda bolaget i revisionsärenden.',
    'Ger den auktoriserade revisorn rätt att inhämta information, kommunicera med Skatteverket och företräda bolaget i revisionsrelaterade ärenden.',
    'gratis', 2340, 'company', 'Regleras av revisorslagen (2001:883) och Aktiebolagslagen (2005:551) 9 kap.',
    ['fullmakt revisor', 'revisionsfullmakt', 'fullmakt bolag', 'auktoriserad revisor'],
    [0, 3, 5], None))

T.append(('fullmakt-handelsbolag', 'Fullmakt handelsbolag', 'ekonomi-myndigheter',
    'Fullmakt för bolagsman att företräda handelsbolaget.',
    'Ger en bolagsman eller utomstående rätt att handla för handelsbolagets räkning. Eftersom bolagsmännen har personligt ansvar är detta särskilt viktigt vid större affärer.',
    'gratis', 1820, 'company', 'Regleras av lagen om handelsbolag och enkla bolag (1980:1102).',
    ['fullmakt handelsbolag', 'fullmakt HB', 'bolagsman fullmakt'],
    [0, 5, 6], None))

T.append(('fullmakt-enskild-firma', 'Fullmakt enskild firma', 'ekonomi-myndigheter',
    'Fullmakt för innehavaren av enskild firma att låta annan agera.',
    'Eftersom enskild firma inte är en juridisk person agerar du som privatperson. Fullmakten ger ombudet rätt att hantera firmans löpande ärenden – fakturering, bankärenden, myndighetskontakter.',
    'popular', 5670, 'standard', 'Enskild näringsverksamhet regleras av enskild näringsidkares ansvar – ingen separat juridisk person.',
    ['fullmakt enskild firma', 'fullmakt EF', 'fullmakt företagare'],
    [4, 6, 7], None))

T.append(('fullmakt-vd-arenden', 'VD-fullmakt', 'ekonomi-myndigheter',
    'Fullmakt för VD att binda bolaget i specifika ärenden.',
    'Specificerad fullmakt för VD att fatta beslut utöver den löpande förvaltningen, t.ex. större investeringar eller strategiska avtal. Kompletterar den allmänna VD-behörigheten.',
    'premium', 3420, 'company', 'Aktiebolagslagen (2005:551) 8 kap. om bolagets ledning.',
    ['VD-fullmakt', 'VD fullmakt', 'fullmakt verkställande direktör'],
    [0, 1, 5], None))

T.append(('fullmakt-prokura', 'Prokura', 'ekonomi-myndigheter',
    'Bred näringsrättslig fullmakt enligt prokuralagen.',
    'Prokura är en omfattande näringsfullmakt som ger ombudet rätt att utföra alla rättshandlingar inom näringsverksamheten – med undantag för fastighetsförsäljning och pantsättning. Ska registreras hos Bolagsverket.',
    'premium', 2210, 'company', 'Regleras av prokuralagen (1974:158). Ska registreras hos Bolagsverket för att vara fullt gällande mot tredje man.',
    ['prokura', 'fullmakt prokura', 'näringsfullmakt', 'prokuralagen'],
    [0, 6, 8], None))

T.append(('fullmakt-likvidation', 'Fullmakt vid likvidation', 'ekonomi-myndigheter',
    'Fullmakt för likvidator eller ombud vid bolagslikvidation.',
    'Ger ombudet rätt att företräda bolagsmännen eller styrelsen under likvidationsförfarandet. Hanterar avveckling av tillgångar, betalning av skulder och slutreglering.',
    'premium', 1180, 'company', 'Aktiebolagslagen (2005:551) 25 kap. om likvidation och konkurs.',
    ['fullmakt likvidation', 'likvidator fullmakt', 'avveckling bolag'],
    [7, 9, 10], None))

T.append(('fullmakt-konkurs-ombud', 'Fullmakt vid konkurs', 'ekonomi-myndigheter',
    'Fullmakt för konkursförvaltarens eller bolagsmännens ombud.',
    'Vid konkurs behöver bolaget ofta företrädas mot konkursförvaltaren, fordringsägare och tingsrätten. Denna fullmakt ger ombudet rätt att agera i dessa ärenden.',
    'premium', 870, 'company', 'Konkurslagen (1987:672) reglerar konkursförfarandet.',
    ['fullmakt konkurs', 'konkurs ombud', 'konkursförvaltare fullmakt'],
    [8, 10, 11], None))

T.append(('fullmakt-patent-arende', 'Fullmakt patentärende', 'ekonomi-myndigheter',
    'Fullmakt för patentombud att hantera patentansökan.',
    'Ger patentombudet (auktoriserat patentkonsult) rätt att lämna in patentansökan, kommunicera med PRV och företräda dig i patentärenden.',
    'gratis', 1450, 'company', 'Regleras av patentlagen (1967:837) och Patent- och registreringsverkets (PRV) föreskrifter.',
    ['fullmakt patent', 'patentombud', 'PRV fullmakt', 'patentansökan ombud'],
    [11, 0, 5], None))

T.append(('fullmakt-varumarke-registrering', 'Fullmakt varumärkesregistrering', 'ekonomi-myndigheter',
    'Fullmakt för ombud att registrera varumärke hos PRV.',
    'Ger ombudet (vanligtvis varumärkesbyrå) rätt att ansöka om, försvara och underhålla varumärket hos PRV eller EUIPO.',
    'gratis', 1670, 'company', 'Varumärkeslagen (2010:1877) och PRV:s regelverk.',
    ['fullmakt varumärke', 'varumärkesregistrering', 'PRV varumärke', 'EUIPO fullmakt'],
    [10, 0, 5], None))

# === FAMILJ (10) → foraldrar-barn / seniorer-omsorg ===
T.append(('framtidsfullmakt-omsesidig-makar', 'Ömsesidig framtidsfullmakt för makar', 'seniorer-omsorg',
    'Två framtidsfullmakter i ett dokument – båda makarna ger varandra ömsesidig framtidsfullmakt.',
    'Båda makarna upprättar samtidigt en framtidsfullmakt för varandra. Träder i kraft för den part som blir oförmögen att fatta beslut. Mycket vanligt för äldre par.',
    'popular', 9870, 'standard', 'Lag (2017:310) om framtidsfullmakter. Kräver bevittning av två vittnen för respektive fullmakt.',
    ['framtidsfullmakt makar', 'ömsesidig framtidsfullmakt', 'framtidsfullmakt äkta makar'],
    [0, 1, 2], None))

T.append(('fullmakt-begravning-anhorig', 'Fullmakt begravning för anhörig', 'digitalt-dodsbo',
    'Fullmakt för anhörig att ordna begravning för den avlidne.',
    'Ger en utvald anhörig rätt att teckna avtal med begravningsbyrån, ordna ceremonin, gravsten och annat praktiskt kring begravningen. Bör utfärdas av samtliga dödsbodelägare.',
    'popular', 6540, 'estate', 'Begravningslagen (1990:1144) och ärvdabalken (1958:637).',
    ['fullmakt begravning', 'begravning anhörig', 'fullmakt begravningsbyrå'],
    [89, 90, 91], None))

T.append(('fullmakt-skilsmassa-ombud', 'Fullmakt skilsmässa', 'foraldrar-barn',
    'Fullmakt för ombud (ofta advokat) att företräda i skilsmässoärende.',
    'Ger ombudet rätt att lämna in ansökan om skilsmässa, företräda dig i bodelning och kommunicera med tingsrätten. Mycket användbart om du är utomlands eller vill ha juridisk företrädare.',
    'premium', 4320, 'standard', 'Äktenskapsbalken (1987:230) reglerar skilsmässa och bodelning.',
    ['fullmakt skilsmässa', 'fullmakt äktenskapsskillnad', 'skilsmässa ombud'],
    [13, 14, 15], None))

T.append(('fullmakt-adoption-arende', 'Fullmakt adoption', 'foraldrar-barn',
    'Fullmakt för ombud att hantera adoptionsärende hos socialnämnden eller MFoF.',
    'Ger ombudet (ofta adoptionsbyrå eller advokat) rätt att kommunicera med socialnämnden, MFoF, tingsrätten och utländska myndigheter under adoptionsprocessen.',
    'premium', 2870, 'standard', 'Föräldrabalken (1949:381) 4 kap. om adoption och lag (1997:191) om internationell adoption.',
    ['fullmakt adoption', 'adoption ombud', 'MFoF fullmakt'],
    [14, 16, 17], None))

T.append(('medgivande-barnpassning-regelbunden', 'Medgivande för regelbunden barnpassning', 'foraldrar-barn',
    'Medgivande för barnvakt, mor-/farförälder eller dagbarnvårdare att passa barnet regelbundet.',
    'Specificerar omfattning, ansvar och tidsperiod för regelbunden barnpassning. Ger barnvakten rätt att fatta vissa vardagliga beslut, hämta från skola, akut sjukvård etc.',
    'gratis', 5430, 'child', 'Föräldrabalken (1949:381). Vårdnadshavare delegerar inte vårdnaden men ger samtycke till vardagliga beslut.',
    ['medgivande barnpassning', 'fullmakt barnvakt', 'fullmakt mor-/farförälder barn'],
    [12, 16, 17], None))

T.append(('fullmakt-umgangesratt-ombud', 'Fullmakt umgängesrätt', 'foraldrar-barn',
    'Fullmakt för ombud i umgängesrättstvister.',
    'Ger advokat eller annat ombud rätt att företräda en vårdnadshavare i tvister om umgänge, vårdnad eller boende. Kommunicerar med tingsrätt, socialnämnd och motparten.',
    'premium', 3210, 'standard', 'Föräldrabalken (1949:381) 6 kap. om vårdnad, boende och umgänge.',
    ['fullmakt umgänge', 'fullmakt vårdnadstvist', 'umgängesrätt ombud'],
    [13, 14, 17], None))

T.append(('fullmakt-vardnadshavare-bistand', 'Fullmakt vårdnadshavare bistånd', 'foraldrar-barn',
    'Fullmakt för annan vuxen att bistå vårdnadshavaren tillfälligt.',
    'Vid sjukdom, resa eller annan tillfällig frånvaro ger denna fullmakt en annan vuxen rätt att bistå med vardagliga beslut, hämta från skola och vid behov söka vård.',
    'gratis', 4560, 'child', 'Föräldrabalken (1949:381). Vårdnadsansvaret kvarstår hos vårdnadshavaren men beslut kan delegeras.',
    ['fullmakt vårdnadshavare', 'tillfällig vårdnad fullmakt', 'medgivande barn bistånd'],
    [16, 15, 12], None))

T.append(('fullmakt-sambo-avtal-ombud', 'Fullmakt sambo-avtal', 'foraldrar-barn',
    'Fullmakt för ombud att upprätta eller företräda i sambolagens ärenden.',
    'Ger ombudet rätt att förhandla, upprätta sambo-avtal eller företräda dig i bodelning enligt sambolagen. Lämpligt om du är utomlands eller vill ha juridisk företrädare.',
    'gratis', 1980, 'standard', 'Sambolagen (2003:376) reglerar samboegendom och bodelning vid separation.',
    ['fullmakt sambo', 'sambo-avtal ombud', 'sambolagen fullmakt', 'samboegendom fullmakt'],
    [13, 14, 15], None))

T.append(('fullmakt-foraldraledighet-myndighet', 'Fullmakt föräldraledighet myndighet', 'foraldrar-barn',
    'Fullmakt för partner eller ombud att hantera föräldraledighetsärenden.',
    'Ger ombudet rätt att kommunicera med Försäkringskassan, arbetsgivare och kommunen om föräldrapenning, VAB och föräldraledighet.',
    'gratis', 3450, 'standard', 'Föräldraledighetslagen (1995:584) och socialförsäkringsbalken (2010:110).',
    ['fullmakt föräldraledighet', 'fullmakt föräldrapenning', 'försäkringskassan föräldraledighet'],
    [15, 16, 17], None))

T.append(('fullmakt-familjeradgivning-ombud', 'Fullmakt familjerådgivning', 'foraldrar-barn',
    'Fullmakt för ombud att begära familjerådgivning hos kommunen.',
    'Ger ombudet rätt att initiera, boka och kommunicera med familjerådgivningen i din kommun. Kan användas vid uppslitande situationer.',
    'gratis', 1240, 'standard', 'Socialtjänstlagen (2001:453) reglerar familjerådgivning som kommunens ansvar.',
    ['fullmakt familjerådgivning', 'kommunal familjerådgivning fullmakt'],
    [15, 13, 19], None))

# === MYNDIGHETER (12) → ekonomi-myndigheter ===
T.append(('fullmakt-kommun-arende', 'Fullmakt kommunärende', 'ekonomi-myndigheter',
    'Allmän fullmakt för att företräda dig hos kommunen.',
    'Ger ombudet rätt att kommunicera med kommunen i bygglov, bostadsfrågor, försörjningsstöd, äldreomsorg eller annat. Specificera vilken nämnd eller ärendetyp.',
    'gratis', 5670, 'standard', 'Kommunallagen (2017:725) och förvaltningslagen (2017:900) reglerar kommunens ärendehantering.',
    ['fullmakt kommun', 'kommunärende ombud', 'fullmakt kommunala myndigheter'],
    [21, 22, 23], None))

T.append(('fullmakt-lantmateriet', 'Fullmakt Lantmäteriet', 'ekonomi-myndigheter',
    'Fullmakt för ombud att hantera ärenden hos Lantmäteriet.',
    'Ger ombudet rätt att ansöka om lagfart, inteckningar, fastighetsbildning och andra Lantmäteri-ärenden. Vanligt vid bostadsköp där köparen inte kan närvara.',
    'popular', 7340, 'realestate', 'Jordabalken (1970:994) och fastighetsbildningslagen (1970:988).',
    ['fullmakt Lantmäteriet', 'lagfart fullmakt', 'fastighetsbildning fullmakt'],
    [20, 34, 35], None))

T.append(('fullmakt-polisanmalan-ombud', 'Fullmakt polisanmälan', 'ekonomi-myndigheter',
    'Fullmakt för ombud att göra polisanmälan i ditt namn.',
    'Ger ombudet rätt att göra polisanmälan, lämna in handlingar och företräda dig i polisärenden. Lämpligt om du är skadad, utomlands eller saknar förmåga.',
    'gratis', 2890, 'standard', 'Rättegångsbalken (1942:740) reglerar förundersökning och polisanmälan.',
    ['fullmakt polisanmälan', 'polisanmälan ombud', 'fullmakt polisen'],
    [20, 23, 33], None))

T.append(('fullmakt-passfornyelse-vuxen', 'Fullmakt passförnyelse vuxen', 'ekonomi-myndigheter',
    'Fullmakt för annan person att ansöka om passförnyelse för vuxen.',
    'Ger ombudet rätt att hjälpa till med passansökan i begränsade fall – t.ex. vid sjukdom. Notera att passansökan kräver personlig inställelse för fingeravtryck och foto.',
    'gratis', 1840, 'standard', 'Passlagen (1978:302). Observera: passansökan kräver normalt personlig inställelse.',
    ['fullmakt pass vuxen', 'passförnyelse fullmakt', 'fullmakt passansökan vuxen'],
    [20, 23, 25], None))

T.append(('fullmakt-csn-ansokan', 'Fullmakt CSN-ärenden', 'ekonomi-myndigheter',
    'Fullmakt för ombud att hantera ärenden hos CSN.',
    'Ger ombudet rätt att ansöka om studielån, kommunicera med CSN och hantera återbetalningsärenden. Vanligt för studenter utomlands eller anhöriga som hjälper.',
    'gratis', 4230, 'standard', 'Studiestödslagen (1999:1395) reglerar CSN-stöd.',
    ['fullmakt CSN', 'CSN ombud', 'studielån fullmakt'],
    [20, 26, 27], None))

T.append(('fullmakt-fk-sjukpenning', 'Fullmakt Försäkringskassan sjukpenning', 'ekonomi-myndigheter',
    'Fullmakt för anhörig att hantera sjukpenningärenden hos Försäkringskassan.',
    'Ger ombudet rätt att ansöka om sjukpenning, kommunicera med Försäkringskassan och överklaga beslut. Lämpligt vid längre sjukskrivningar.',
    'popular', 6790, 'standard', 'Socialförsäkringsbalken (2010:110) reglerar sjukpenning och Försäkringskassans handläggning.',
    ['fullmakt FK sjukpenning', 'fullmakt försäkringskassan', 'sjukpenning ombud'],
    [25, 27, 41], None))

T.append(('fullmakt-arbetsloshet-arende', 'Fullmakt arbetslöshet (a-kassa)', 'ekonomi-myndigheter',
    'Fullmakt för ombud att hantera a-kasseärende.',
    'Ger ombudet rätt att kommunicera med a-kassan, Arbetsförmedlingen och hantera ersättningsfrågor. Lämpligt vid utlandsvistelse eller sjukdom.',
    'gratis', 3120, 'standard', 'Lag om arbetslöshetsförsäkring (1997:238).',
    ['fullmakt a-kassa', 'fullmakt arbetslöshet', 'fullmakt arbetsförmedlingen'],
    [25, 26, 41], None))

T.append(('fullmakt-jordbruksverket', 'Fullmakt Jordbruksverket', 'ekonomi-myndigheter',
    'Fullmakt för ombud att hantera ärenden hos Jordbruksverket.',
    'Ger ombudet rätt att söka EU-stöd, hantera djurregistrering och kommunicera med Jordbruksverket. Vanligt för lantbruksföretagare.',
    'gratis', 1340, 'standard', 'Jordbruksverkets verksamhet regleras av miljöbalken, djurskyddslagen och EU:s jordbrukspolitik.',
    ['fullmakt Jordbruksverket', 'lantbruksstöd fullmakt', 'EU-stöd fullmakt'],
    [28, 30, 31], None))

T.append(('fullmakt-skogsstyrelsen', 'Fullmakt Skogsstyrelsen', 'ekonomi-myndigheter',
    'Fullmakt för ombud att hantera skogsbruksärenden hos Skogsstyrelsen.',
    'Ger ombudet rätt att lämna avverkningsanmälan, ansöka om skogsbruksbidrag och kommunicera med Skogsstyrelsen.',
    'gratis', 980, 'standard', 'Skogsvårdslagen (1979:429) och Skogsstyrelsens föreskrifter.',
    ['fullmakt Skogsstyrelsen', 'avverkningsanmälan fullmakt', 'skogsbruk ombud'],
    [27, 29, 31], None))

T.append(('fullmakt-statlig-tjanst-anvisning', 'Fullmakt statlig tjänsteanvisning', 'ekonomi-myndigheter',
    'Fullmakt för ombud att hantera kontakt med statlig myndighet vid utnämning eller tjänsteanvisning.',
    'Ger ombudet rätt att kommunicera med statlig myndighet i tillsättningsärenden, lönefrågor och placering.',
    'gratis', 670, 'standard', 'Lag (1994:260) om offentlig anställning och statstjänstemannalagen.',
    ['fullmakt statlig anställning', 'tjänsteanvisning fullmakt'],
    [25, 26, 31], None))

T.append(('fullmakt-vapenlicens-ombud', 'Fullmakt vapenlicens', 'ekonomi-myndigheter',
    'Fullmakt för ombud att hantera vapenlicensärende hos polisen.',
    'Ger ombudet rätt att ansöka om eller förnya vapenlicens, lämna in handlingar och kommunicera med polisens tillståndsenhet.',
    'premium', 1450, 'standard', 'Vapenlagen (1996:67) reglerar vapenlicens och polismyndighetens prövning.',
    ['fullmakt vapenlicens', 'fullmakt polisen vapen', 'vapenlicens ombud'],
    [22, 33, 41], None))

T.append(('fullmakt-hemvarnet-anmalan', 'Fullmakt hemvärnet anmälan', 'ekonomi-myndigheter',
    'Fullmakt för anhörig vid anmälan eller avanmälan från hemvärnet.',
    'Ger ombudet rätt att kommunicera med Försvarsmakten/hemvärnet om tjänstgöring, avanmälan eller praktiska frågor.',
    'gratis', 540, 'standard', 'Förordning (1997:147) med instruktion för Försvarsmakten och Hemvärnsförordningen (1997:146).',
    ['fullmakt hemvärnet', 'fullmakt Försvarsmakten', 'hemvärnsärende ombud'],
    [30, 33, 31], None))

# === FASTIGHET (10) → boende-vardag ===
T.append(('fullmakt-fastighetsforsaljning-villa', 'Fullmakt fastighetsförsäljning villa', 'boende-vardag',
    'Fullmakt för att sälja villa, fritidshus eller annan fast egendom.',
    'Mycket viktig fullmakt – ger ombudet rätt att underteckna köpekontrakt och köpebrev för fast egendom. Kräver bevittning av två vittnen enligt jordabalken.',
    'premium', 5670, 'realestate', 'Jordabalken (1970:994) 4 kap. 3 § kräver bevittning av två vittnen och notariell bekräftelse.',
    ['fullmakt fastighetsförsäljning', 'fullmakt sälja villa', 'fastighetsförsäljning ombud', 'fullmakt köpekontrakt'],
    [33, 34, 35], None))

T.append(('fullmakt-lagfart-ansokan', 'Fullmakt lagfart', 'boende-vardag',
    'Fullmakt för ombud att ansöka om lagfart hos Lantmäteriet.',
    'Ger ombudet (ofta jurist eller mäklare) rätt att lämna in lagfartsansökan, betala stämpelskatt och företräda dig i Lantmäteriet-ärendet.',
    'popular', 4320, 'realestate', 'Jordabalken (1970:994) 20 kap. om lagfart.',
    ['fullmakt lagfart', 'lagfart ombud', 'fullmakt Lantmäteriet'],
    [32, 34, 35], None))

T.append(('fullmakt-inteckning-pantbrev', 'Fullmakt inteckning och pantbrev', 'boende-vardag',
    'Fullmakt för bank eller mäklare att ansöka om inteckning.',
    'Ger ombudet rätt att ansöka om inteckning hos Lantmäteriet och ta emot pantbrev. Standardförfarande vid bolåneprocessen.',
    'popular', 6890, 'realestate', 'Jordabalken (1970:994) 22 kap. om inteckning.',
    ['fullmakt inteckning', 'fullmakt pantbrev', 'bolån fullmakt'],
    [32, 33, 35], None))

T.append(('fullmakt-tomtratt-ombud', 'Fullmakt tomträtt', 'boende-vardag',
    'Fullmakt för ombud att hantera tomträttsärenden hos kommunen eller Lantmäteriet.',
    'Ger ombudet rätt att förhandla, förnya eller överlåta tomträtt åt dig.',
    'gratis', 1230, 'realestate', 'Jordabalken (1970:994) 13 kap. om tomträtt.',
    ['fullmakt tomträtt', 'tomträtt ombud', 'fullmakt kommun tomt'],
    [34, 32, 33], None))

T.append(('fullmakt-arrende-avtal', 'Fullmakt arrende', 'boende-vardag',
    'Fullmakt för ombud att teckna eller förhandla arrendeavtal.',
    'Ger ombudet rätt att förhandla, teckna och säga upp arrendeavtal (jordbruks-, anläggnings-, bostads- eller lägenhetsarrende).',
    'gratis', 980, 'standard', 'Jordabalken (1970:994) 7-11 kap. om arrende.',
    ['fullmakt arrende', 'arrende ombud', 'jordbruksarrende fullmakt'],
    [36, 37, 38], None))

T.append(('fullmakt-servitut-anlaggning', 'Fullmakt servitut', 'boende-vardag',
    'Fullmakt för ombud att förhandla eller registrera servitut.',
    'Ger ombudet rätt att förhandla servitutsavtal och ansöka om officialservitut hos Lantmäteriet.',
    'gratis', 850, 'realestate', 'Jordabalken (1970:994) 14 kap. om servitut och fastighetsbildningslagen.',
    ['fullmakt servitut', 'officialservitut fullmakt', 'servitut Lantmäteriet'],
    [32, 35, 37], None))

T.append(('fullmakt-strandskyddsdispens', 'Fullmakt strandskyddsdispens', 'boende-vardag',
    'Fullmakt för ombud att ansöka om strandskyddsdispens.',
    'Ger ombudet rätt att förbereda och lämna in ansökan om dispens från strandskyddet hos kommunens eller länsstyrelsens miljönämnd.',
    'premium', 670, 'standard', 'Miljöbalken (1998:808) 7 kap. om strandskydd.',
    ['fullmakt strandskydd', 'strandskyddsdispens ombud', 'fullmakt länsstyrelsen miljö'],
    [38, 35, 32], None))

T.append(('fullmakt-bygglov-ansokan', 'Fullmakt bygglov', 'boende-vardag',
    'Fullmakt för arkitekt eller ombud att ansöka om bygglov.',
    'Ger ombudet (arkitekt, byggfirma) rätt att lämna in bygglovsansökan, kommunicera med byggnadsnämnden och fatta beslut om mindre justeringar.',
    'popular', 5430, 'standard', 'Plan- och bygglagen (2010:900).',
    ['fullmakt bygglov', 'bygglov ombud', 'arkitekt fullmakt bygglov'],
    [37, 32, 35], None))

T.append(('fullmakt-fastighetsavstyckning', 'Fullmakt fastighetsavstyckning', 'boende-vardag',
    'Fullmakt för ombud att ansöka om avstyckning hos Lantmäteriet.',
    'Ger ombudet rätt att begära avstyckning, sammanläggning eller klyvning av fastighet hos Lantmäteriet.',
    'premium', 1120, 'realestate', 'Fastighetsbildningslagen (1970:988).',
    ['fullmakt avstyckning', 'fastighetsbildning fullmakt', 'fullmakt Lantmäteriet'],
    [32, 35, 33], None))

T.append(('fullmakt-forsaljning-lantbruk', 'Fullmakt försäljning lantbruksfastighet', 'boende-vardag',
    'Fullmakt för att sälja lantbruks- eller skogsfastighet.',
    'Specifik fullmakt för försäljning av lantbruksfastighet med skog, jordbruk eller andra tillhörande rättigheter. Kräver bevittning enligt jordabalken.',
    'premium', 780, 'realestate', 'Jordabalken (1970:994) och jordförvärvslagen (1979:230) som reglerar förvärv av lantbruksfastighet.',
    ['fullmakt lantbruk', 'fullmakt skogsfastighet', 'försäljning lantbruk ombud'],
    [30, 32, 33], None))

# === HÄLSA (10) → vard-omsorg ===
T.append(('fullmakt-livstestamente', 'Livstestamente', 'vard-omsorg',
    'Skriftlig viljeyttring om livsuppehållande behandling vid svår sjukdom.',
    'Anger din vilja om vård i livets slutskede – t.ex. om livsuppehållande behandling ska sättas in eller avstås. Är inte juridiskt bindande i Sverige men respekteras starkt av vårdpersonal.',
    'popular', 8970, 'medical', 'Patientlagen (2014:821) 4 kap. om patientens medverkan i vården.',
    ['livstestamente', 'fullmakt vård i livets slut', 'palliativ vård fullmakt'],
    [42, 43, 44], None))

T.append(('fullmakt-vardonskemal', 'Fullmakt vårdönskemål', 'vard-omsorg',
    'Fullmakt med detaljerade önskemål om medicinsk behandling.',
    'Komplement till livstestamente – specificerar dina vårdönskemål för olika scenarier och utser ett ombud som ska företräda dig om du blir oförmögen.',
    'popular', 5430, 'medical', 'Patientlagen (2014:821) reglerar samråd och samtycke.',
    ['fullmakt vårdönskemål', 'vårddirektiv', 'patient direktiv'],
    [41, 43, 44], None))

T.append(('medgivande-tandreglering-barn', 'Medgivande tandreglering barn', 'vard-omsorg',
    'Vårdnadshavares medgivande för tandreglering av barn under 18.',
    'Medgivande som krävs av tandläkaren innan tandreglering (ortodontisk behandling) påbörjas för minderårig. Specificerar behandling, omfattning och kostnad.',
    'gratis', 4320, 'child', 'Tandvårdslagen (1985:125) och patientlagen (2014:821).',
    ['medgivande tandreglering', 'tandreglering barn fullmakt', 'ortodonti barn samtycke'],
    [45, 47, 46], None))

T.append(('medgivande-blodprov-barn', 'Medgivande blodprov barn', 'vard-omsorg',
    'Medgivande för blodprov eller annan provtagning på minderårig.',
    'Vårdnadshavares medgivande till blodprov, urinprov eller annan provtagning på barn. Krävs vid icke-akut provtagning eller forskning.',
    'gratis', 2870, 'child', 'Patientlagen (2014:821) 4 kap. och lag (2003:460) om etikprövning av forskning på människor.',
    ['medgivande blodprov barn', 'provtagning barn samtycke', 'forskning på barn medgivande'],
    [43, 45, 47], None))

T.append(('medgivande-fertilitetsbehandling', 'Medgivande fertilitetsbehandling', 'vard-omsorg',
    'Medgivande från par eller individ till assisterad befruktning.',
    'Skriftligt medgivande från partner och eventuella donatorer vid IVF, insemination eller annan assisterad befruktning. Krävs av vårdgivaren.',
    'premium', 2340, 'medical', 'Lag (2006:351) om genetisk integritet m.m. och lag (1984:1140) om insemination.',
    ['medgivande IVF', 'medgivande fertilitetsbehandling', 'assisterad befruktning samtycke'],
    [42, 46, 48], None))

T.append(('medgivande-organdonation-levande', 'Medgivande organdonation levande', 'vard-omsorg',
    'Medgivande från levande donator vid njure- eller leverdonation.',
    'Skriftligt medgivande från levande organdonator (oftast närstående). Genomgår strikt etisk prövning och kräver upprepad bekräftelse.',
    'premium', 980, 'medical', 'Lag (1995:831) om transplantation m.m.',
    ['medgivande organdonation', 'levande donator samtycke', 'njurdonation fullmakt'],
    [41, 42, 48], None))

T.append(('medgivande-vaccin-barn', 'Medgivande vaccination barn', 'vard-omsorg',
    'Vårdnadshavares medgivande för vaccination av minderårig.',
    'Specificerar vilka vacciner barnet får ta och under vilka omständigheter. Användbart när annan vuxen följer med barnet till vården.',
    'gratis', 6540, 'child', 'Smittskyddslagen (2004:168) och patientlagen (2014:821).',
    ['medgivande vaccin barn', 'vaccination samtycke', 'fullmakt vaccinera barn'],
    [44, 45, 47], None))

T.append(('medgivande-operation-barn', 'Medgivande operation barn', 'vard-omsorg',
    'Vårdnadshavares medgivande för planerad operation av minderårig.',
    'Skriftligt medgivande från båda vårdnadshavare för icke-akut operation. Krävs av sjukhuset innan ingreppet kan genomföras.',
    'popular', 4230, 'child', 'Patientlagen (2014:821) 4 kap. om samråd och samtycke.',
    ['medgivande operation barn', 'operation barn samtycke', 'kirurgi barn fullmakt'],
    [42, 44, 47], None))

T.append(('medgivande-genetisk-testning', 'Medgivande genetisk testning', 'vard-omsorg',
    'Medgivande till genetisk testning eller DNA-analys.',
    'Skriftligt informerat samtycke till genetisk testning, fosterdiagnostik eller DNA-analys. Inkluderar information om hantering av resultat.',
    'premium', 1340, 'medical', 'Lag (2006:351) om genetisk integritet m.m. 3 kap.',
    ['medgivande genetisk test', 'DNA-test samtycke', 'fosterdiagnostik samtycke'],
    [44, 48, 49], None))

T.append(('medgivande-estetisk-behandling', 'Medgivande estetisk behandling', 'vard-omsorg',
    'Medgivande till estetisk eller kosmetisk behandling.',
    'Informerat samtycke till estetiska ingrepp – t.ex. botox, fillers eller plastikkirurgi. Bekräftar att du fått information om risker och alternativ.',
    'gratis', 1670, 'medical', 'Patientsäkerhetslagen (2010:659) och Inspektionen för vård och omsorgs (IVO) tillsyn.',
    ['medgivande estetisk behandling', 'samtycke skönhetsbehandling', 'plastikkirurgi samtycke'],
    [41, 42, 47], None))

# === FORDON (10) → resa-transport ===
T.append(('fullmakt-mc-agarbyte', 'Fullmakt MC ägarbyte', 'resa-transport',
    'Fullmakt för att sälja eller registrera motorcykel.',
    'Ger ombudet rätt att hantera ägarbyte, registrering och försäkring för motorcykeln hos Transportstyrelsen.',
    'gratis', 2340, 'vehicle', None,
    ['fullmakt MC', 'motorcykel ägarbyte', 'fullmakt sälja MC'],
    [55, 56, 57], None))

T.append(('fullmakt-husbil-arende', 'Fullmakt husbil', 'resa-transport',
    'Fullmakt för försäljning, registrering eller besiktning av husbil.',
    'Ger ombudet rätt att hantera alla husbils-relaterade ärenden – ägarbyte, registrering, försäkring och besiktning.',
    'gratis', 1890, 'vehicle', None,
    ['fullmakt husbil', 'husbil försäljning', 'husbil registrering ombud'],
    [54, 56, 57], None))

T.append(('fullmakt-husvagn-forsaljning', 'Fullmakt husvagn försäljning', 'resa-transport',
    'Fullmakt för försäljning eller registrering av husvagn.',
    'Ger ombudet rätt att sälja, anmäla ägarbyte och registrera/avregistrera husvagn hos Transportstyrelsen.',
    'gratis', 1560, 'vehicle', None,
    ['fullmakt husvagn', 'husvagn försäljning', 'husvagn ägarbyte'],
    [54, 55, 57], None))

T.append(('fullmakt-snoskoter-agarbyte', 'Fullmakt snöskoter ägarbyte', 'resa-transport',
    'Fullmakt för försäljning eller ägarbyte av snöskoter.',
    'Ger ombudet rätt att anmäla ägarbyte, ansöka om registrering och hantera snöskoter-relaterade ärenden.',
    'gratis', 980, 'vehicle', None,
    ['fullmakt snöskoter', 'snöskoter ägarbyte', 'fullmakt snowmobile'],
    [54, 58, 59], None))

T.append(('fullmakt-traktor-registrering', 'Fullmakt traktor registrering', 'resa-transport',
    'Fullmakt för registrering, besiktning eller försäljning av traktor.',
    'Ger ombudet rätt att hantera traktor-relaterade ärenden hos Transportstyrelsen, inklusive registrering och besiktning.',
    'gratis', 870, 'vehicle', None,
    ['fullmakt traktor', 'traktor registrering', 'traktor ägarbyte'],
    [58, 59, 53], None))

T.append(('fullmakt-epa-traktor', 'Fullmakt EPA-traktor', 'resa-transport',
    'Fullmakt för EPA-traktor (A-traktor) – ägarbyte och registrering.',
    'Ger ombudet rätt att hantera EPA-traktor / A-traktor-ärenden hos Transportstyrelsen. Vanligt för förälder som hjälper ungdom.',
    'popular', 3450, 'vehicle', None,
    ['fullmakt EPA-traktor', 'A-traktor fullmakt', 'EPA-traktor ägarbyte'],
    [57, 54, 53], None))

T.append(('fullmakt-bat-registrering-2026', 'Fullmakt båtregistrering 2026', 'resa-transport',
    'Fullmakt för registrering av båt hos Transportstyrelsen.',
    'Ger ombudet rätt att registrera båt eller anmäla ägarbyte i båtregistret. Krävs för båtar över 5 m längd.',
    'gratis', 1230, 'vehicle', 'Lag (1979:377) om registrering av båtar för yrkesmässig sjöfart m.m. samt sjötrafikförordningen.',
    ['fullmakt båt', 'båtregistrering 2026', 'båt ägarbyte'],
    [56, 58, 57], None))

T.append(('fullmakt-atv-arende', 'Fullmakt ATV', 'resa-transport',
    'Fullmakt för ATV (terränghjuling) – registrering, ägarbyte, försäljning.',
    'Ger ombudet rätt att hantera ATV-/terränghjulings-ärenden hos Transportstyrelsen.',
    'gratis', 540, 'vehicle', None,
    ['fullmakt ATV', 'fullmakt terränghjuling', 'ATV ägarbyte'],
    [54, 56, 57], None))

T.append(('fullmakt-lastbil-foretag', 'Fullmakt lastbil företag', 'resa-transport',
    'Fullmakt för företag att låta anställd hantera lastbils-ärenden.',
    'Ger anställd eller speditör rätt att hantera lastbil/tunga fordon hos Transportstyrelsen – registrering, ägarbyte, kontrollbesiktning.',
    'premium', 670, 'company', 'Yrkestrafiklagen (2012:210) och Transportstyrelsens föreskrifter.',
    ['fullmakt lastbil', 'lastbil företag', 'tunga fordon ombud'],
    [54, 4, 59], None))

T.append(('fullmakt-veteranfordon-arende', 'Fullmakt veteranfordon', 'resa-transport',
    'Fullmakt för försäljning, besiktning eller registrering av veteranfordon.',
    'Ger ombudet rätt att hantera veteranfordon (över 30 år) hos Transportstyrelsen och försäkringsbolaget.',
    'gratis', 450, 'vehicle', None,
    ['fullmakt veteranfordon', 'veteranbil ägarbyte', 'historiskt fordon fullmakt'],
    [54, 55, 56], None))

# === DIGITALT (8) → digitalt-dodsbo ===
T.append(('fullmakt-google-konto-dodsbo', 'Fullmakt Google-konto dödsbo', 'digitalt-dodsbo',
    'Fullmakt för att hantera den avlidnes Google-konto.',
    'Ger ombudet rätt att begära åtkomst, ladda ner data eller stänga den avlidnes Google-konto via Googles "Inactive Account Manager" eller anhörig-process.',
    'popular', 3450, 'digital', None,
    ['fullmakt Google', 'Google-konto dödsbo', 'Google legacy', 'Gmail dödsbo'],
    [65, 66, 67], None))

T.append(('fullmakt-apple-id-dodsbo', 'Fullmakt Apple ID dödsbo', 'digitalt-dodsbo',
    'Fullmakt för att hantera den avlidnes Apple ID och iCloud.',
    'Ger ombudet rätt att begära åtkomst till den avlidnes Apple ID via Apples "Legacy Contact"-process. Krävs ofta även domstolsbeslut.',
    'popular', 2870, 'digital', None,
    ['fullmakt Apple ID', 'Apple legacy contact', 'iCloud dödsbo', 'Apple konto avliden'],
    [64, 66, 67], None))

T.append(('fullmakt-spotify-abonnemang', 'Fullmakt Spotify-abonnemang', 'digitalt-dodsbo',
    'Fullmakt för att avsluta eller överta Spotify-abonnemang.',
    'Ger ombudet rätt att kontakta Spotify för att avsluta abonnemang, hämta uppspelningshistorik eller överta familjekonto.',
    'gratis', 1230, 'digital', None,
    ['fullmakt Spotify', 'Spotify dödsbo', 'avsluta abonnemang fullmakt'],
    [64, 65, 67], None))

T.append(('fullmakt-bankapp-tillgang', 'Fullmakt bankapp tillgång', 'digitalt-dodsbo',
    'Fullmakt för anhörig att hantera bankapp och digitala bankärenden.',
    'Specifik fullmakt för digital bankåtkomst – internetbank, bank-app och Mobilt BankID. Notera att BankID är personligt och inte kan delegeras direkt.',
    'popular', 4560, 'digital', 'Avtalslagen (1915:218) och bankernas digitala tjänstevillkor.',
    ['fullmakt bankapp', 'fullmakt internetbank', 'digital bank fullmakt'],
    [67, 27, 8], None))

T.append(('fullmakt-e-legitimation', 'Fullmakt e-legitimation', 'digitalt-dodsbo',
    'Fullmakt rörande e-legitimation / Mobilt BankID.',
    'Klargör att Mobilt BankID och Freja eID inte kan överlåtas – fullmakten reglerar istället att ombudet kan göra ärenden på fullmaktsgivarens vägnar mot myndigheter och banker.',
    'gratis', 1780, 'digital', 'BankID-koden är personlig enligt avtal med utfärdaren. Fullmakter ersätter inte e-legitimation utan kompletterar.',
    ['fullmakt e-legitimation', 'fullmakt BankID', 'Freja eID fullmakt'],
    [67, 27, 32], None))

T.append(('fullmakt-microsoft-konto', 'Fullmakt Microsoft-konto', 'digitalt-dodsbo',
    'Fullmakt för att hantera Microsoft-konto, OneDrive eller Office 365.',
    'Ger ombudet rätt att kontakta Microsoft för åtkomst eller avslut av konto, OneDrive-data och Office-licens.',
    'gratis', 870, 'digital', None,
    ['fullmakt Microsoft', 'Microsoft-konto fullmakt', 'OneDrive dödsbo'],
    [64, 65, 70], None))

T.append(('fullmakt-sociala-medier-foretag', 'Fullmakt sociala medier företag', 'digitalt-dodsbo',
    'Fullmakt för anställd att hantera företagets sociala mediekonton.',
    'Ger en marknadsförare eller anställd rätt att hantera företagets Instagram, Facebook, LinkedIn, TikTok och YouTube. Inkluderar inloggningar, annonsbudgetar och innehåll.',
    'premium', 2340, 'company', None,
    ['fullmakt sociala medier företag', 'fullmakt Instagram företag', 'fullmakt Facebook ads'],
    [0, 70, 5], None))

T.append(('fullmakt-molntjanst-foretag', 'Fullmakt molntjänst företag', 'digitalt-dodsbo',
    'Fullmakt för IT-personal att administrera företagets molntjänster.',
    'Ger ombudet rätt att administrera AWS, Azure, Google Cloud eller andra molntjänster för företagets räkning – inklusive användarhantering, fakturering och säkerhetskonfiguration.',
    'premium', 980, 'company', None,
    ['fullmakt molntjänst', 'fullmakt AWS', 'fullmakt Azure', 'IT-admin fullmakt'],
    [69, 0, 5], None))

# === INTERNATIONELLT (8) → ekonomi-myndigheter ===
T.append(('fullmakt-apostille-ansokan', 'Fullmakt apostille', 'ekonomi-myndigheter',
    'Fullmakt för ombud att ansöka om apostille hos Notarius Publicus.',
    'Ger ombudet rätt att lämna in handlingar för apostille (intyg om dokumentens äkthet) hos Notarius Publicus. Krävs ofta vid utlandsstudier, arbete eller affärer.',
    'popular', 3210, 'international', None,
    ['fullmakt apostille', 'apostille ombud', 'Notarius Publicus fullmakt'],
    [73, 74, 75], None))

T.append(('fullmakt-konsulat-arende', 'Fullmakt konsulat', 'ekonomi-myndigheter',
    'Fullmakt för ombud att företräda dig hos svenska eller utländska konsulat.',
    'Ger ombudet rätt att kommunicera med Sveriges utlandsmyndigheter (ambassad, konsulat) eller utländska konsulat i Sverige.',
    'gratis', 1450, 'international', 'Wienkonventionen om konsulära förbindelser (1963) och Sveriges utlandsmyndigheter.',
    ['fullmakt konsulat', 'fullmakt ambassad', 'konsulärt ärende ombud'],
    [72, 74, 75], None))

T.append(('fullmakt-legalisering-dokument', 'Fullmakt legalisering dokument', 'ekonomi-myndigheter',
    'Fullmakt för ombud att legalisera dokument hos UD eller ambassad.',
    'Krävs när dokument ska användas i länder som INTE undertecknat Haagkonventionen. Ombudet hanterar processen via Sveriges UD och mottagarlandets ambassad.',
    'premium', 670, 'international', None,
    ['fullmakt legalisering', 'legalisering UD', 'fullmakt ambassad legalisering'],
    [72, 73, 75], None))

T.append(('fullmakt-oversatt-internationell', 'Översatt internationell fullmakt (Power of Attorney)', 'ekonomi-myndigheter',
    'Bilingual svensk/engelsk fullmakt för internationellt bruk.',
    'Tvåspråkig fullmakt på svenska och engelska. Lämplig för utlandsärenden där en engelsk version krävs. Bör kompletteras med apostille eller legalisering.',
    'popular', 2340, 'international', None,
    ['Power of Attorney Swedish', 'internationell fullmakt', 'engelsk fullmakt', 'bilingual fullmakt'],
    [72, 73, 74], None))

T.append(('fullmakt-utlandsflytt-myndighet', 'Fullmakt utlandsflytt', 'ekonomi-myndigheter',
    'Fullmakt för att hantera utlandsflytt – Skatteverket, FK, kommun.',
    'Ger ombudet rätt att anmäla utflyttning hos Skatteverket, hantera ärenden hos Försäkringskassan och avsluta löpande abonnemang.',
    'gratis', 1670, 'international', None,
    ['fullmakt utlandsflytt', 'fullmakt utvandring', 'utflyttningsanmälan ombud'],
    [25, 41, 72], None))

T.append(('fullmakt-ees-arbete-tillstand', 'Fullmakt EES-arbetstillstånd', 'ekonomi-myndigheter',
    'Fullmakt för ombud att ansöka om EES-/EU-arbetstillstånd.',
    'Ger ombudet (ofta arbetsgivare eller jurist) rätt att hantera EES- eller EU-blå kort-ansökan hos Migrationsverket.',
    'premium', 980, 'international', 'Utlänningslagen (2005:716) och EU:s direktiv om EU-blå kort (2009/50/EG).',
    ['fullmakt arbetstillstånd', 'EU-blå kort ombud', 'Migrationsverket fullmakt arbete'],
    [76, 25, 5], None))

T.append(('fullmakt-internationell-adoption', 'Fullmakt internationell adoption', 'ekonomi-myndigheter',
    'Fullmakt för adoptionsbyrå att hantera internationell adoption.',
    'Ger en auktoriserad adoptionsbyrå rätt att hantera adoptionsprocessen mot ursprungslandets myndigheter, MFoF och svenska socialnämnden.',
    'premium', 540, 'international', 'Lag (1997:191) om internationell privaträttslig adoption och Haagkonventionen om internationell adoption (1993).',
    ['fullmakt internationell adoption', 'utlandsadoption ombud', 'MFoF fullmakt'],
    [13, 72, 75], None))

T.append(('fullmakt-utlandsk-fastighet', 'Fullmakt utländsk fastighet', 'ekonomi-myndigheter',
    'Fullmakt för förvärv eller försäljning av fastighet utomlands.',
    'Internationell fullmakt för att köpa, sälja eller förvalta fastighet utomlands. Kräver normalt apostille eller legalisering plus översättning till lokalt språk.',
    'premium', 870, 'international', None,
    ['fullmakt utländsk fastighet', 'fastighet utomlands fullmakt', 'köpa hus Spanien fullmakt'],
    [72, 73, 30], None))

# === EKONOMI (12) → ekonomi-myndigheter ===
T.append(('fullmakt-aktiehandel', 'Fullmakt aktiehandel', 'ekonomi-myndigheter',
    'Fullmakt för rådgivare eller anhörig att handla med dina aktier.',
    'Ger ombudet rätt att köpa, sälja och förvalta aktier på din värdepappersdepå. Specificera om det rör enstaka köp eller löpande diskretionär förvaltning.',
    'popular', 4320, 'financial', 'Värdepappersmarknadslagen (2007:528) och MiFID II-regelverket.',
    ['fullmakt aktiehandel', 'aktiefullmakt', 'fullmakt Avanza Nordnet', 'diskretionär förvaltning'],
    [81, 82, 83], None))

T.append(('fullmakt-fondbyten', 'Fullmakt fondbyten', 'ekonomi-myndigheter',
    'Fullmakt för rådgivare att göra fondbyten i ditt sparande.',
    'Ger ombudet rätt att byta fonder inom din ISK, KF eller pensionssparande. Vanlig vid diskretionär förvaltning eller assistans från anhörig.',
    'popular', 3450, 'financial', 'Lagen (2004:46) om värdepappersfonder och MiFID II.',
    ['fullmakt fondbyte', 'fondrörelse fullmakt', 'PPM fullmakt'],
    [80, 82, 83], None))

T.append(('fullmakt-bolaneansokan', 'Fullmakt bolåneansökan', 'ekonomi-myndigheter',
    'Fullmakt för ombud att förbereda och lämna in bolåneansökan.',
    'Ger ombudet (oftast mäklare eller bolånerådgivare) rätt att förbereda underlag och lämna in bolåneansökan hos banker.',
    'premium', 5670, 'financial', 'Konsumentkreditlagen (2010:1846) och bolånelagen (2016:1024).',
    ['fullmakt bolån', 'bolåneansökan ombud', 'fullmakt bank lån'],
    [83, 84, 85], None))

T.append(('fullmakt-borgensatagande', 'Fullmakt borgensåtagande', 'ekonomi-myndigheter',
    'Fullmakt vid borgensförhandling – ombud agerar för borgensman.',
    'Ger ombudet rätt att förhandla och underteckna borgensåtagande åt dig. Eftersom borgen är personligt ansvarstung bör fullmakten vara mycket specifik.',
    'premium', 1230, 'financial', 'Handelsbalken (1736) 10 kap. om borgen och avtalslagen (1915:218).',
    ['fullmakt borgen', 'borgensåtagande ombud', 'fullmakt bank borgen'],
    [82, 84, 85], None))

T.append(('fullmakt-skuldsanering-ombud', 'Fullmakt skuldsanering', 'ekonomi-myndigheter',
    'Fullmakt för advokat eller jurist att hantera skuldsanering.',
    'Ger ombudet rätt att ansöka om skuldsanering hos Kronofogden, kommunicera med borgenärer och företräda dig i ärendet.',
    'gratis', 2870, 'financial', 'Skuldsaneringslagen (2016:675).',
    ['fullmakt skuldsanering', 'fullmakt Kronofogden skuldsanering', 'skuldsanering ombud'],
    [85, 87, 27], None))

T.append(('fullmakt-kreditupplysning', 'Fullmakt kreditupplysning', 'ekonomi-myndigheter',
    'Fullmakt för ombud att inhämta kreditupplysning.',
    'Ger ombudet rätt att inhämta kreditupplysning från UC, Bisnode eller annan kreditupplysningsbyrå för din räkning.',
    'gratis', 1670, 'financial', 'Kreditupplysningslagen (1973:1173).',
    ['fullmakt kreditupplysning', 'UC fullmakt', 'fullmakt Bisnode'],
    [82, 84, 5], None))

T.append(('fullmakt-pensionssparande', 'Fullmakt pensionssparande', 'ekonomi-myndigheter',
    'Fullmakt för rådgivare att hantera ditt pensionssparande.',
    'Ger ombudet rätt att förvalta IPS, traditionell pension eller tjänstepensionen via diskretionär förvaltning eller specifika instruktioner.',
    'premium', 2340, 'financial', 'Inkomstskattelagen (1999:1229) och pensionsmyndighetens regelverk.',
    ['fullmakt pension', 'pensionssparande ombud', 'PPM fullmakt'],
    [81, 84, 5], None))

T.append(('fullmakt-sparkonto-overforing', 'Fullmakt sparkonto överföring', 'ekonomi-myndigheter',
    'Fullmakt för specifik överföring mellan sparkonton.',
    'Specificerad fullmakt för att genomföra en eller flera överföringar från ditt sparkonto. Vanligt vid utlandsvistelse.',
    'gratis', 980, 'financial', None,
    ['fullmakt sparkonto', 'fullmakt överföring bank', 'sparkonto ombud'],
    [82, 83, 5], None))

T.append(('fullmakt-crowdfunding-investering', 'Fullmakt crowdfunding-investering', 'ekonomi-myndigheter',
    'Fullmakt för rådgivare att göra crowdfunding-investeringar åt dig.',
    'Ger ombudet rätt att investera i crowdfunding-projekt (FundedByMe, Kameo, Tessin etc.) inom angivna ramar och belopp.',
    'gratis', 540, 'financial', 'Lag (2019:1215) om viss verksamhet med konsumentkrediter och EU:s crowdfunding-förordning (EU 2020/1503).',
    ['fullmakt crowdfunding', 'investering ombud', 'fullmakt Kameo Tessin'],
    [80, 82, 5], None))

T.append(('fullmakt-privatlan-ansokan', 'Fullmakt privatlån', 'ekonomi-myndigheter',
    'Fullmakt för ombud att ansöka om privatlån.',
    'Ger ombudet rätt att förbereda och lämna in ansökan om privatlån eller konsumentkredit. Lånebeslutet är personligt och baserat på dina inkomstuppgifter.',
    'gratis', 2120, 'financial', 'Konsumentkreditlagen (2010:1846).',
    ['fullmakt privatlån', 'fullmakt konsumentkredit', 'privatlån ombud'],
    [82, 84, 85], None))

T.append(('fullmakt-foretagslan-ansokan', 'Fullmakt företagslån', 'ekonomi-myndigheter',
    'Fullmakt för företrädare att ansöka om företagslån.',
    'Ger ombudet rätt att lämna in ansökan om företagslån, presentera affärsplan och förhandla villkor med bank.',
    'premium', 1670, 'company', None,
    ['fullmakt företagslån', 'företagsfullmakt lån', 'företagslån ombud'],
    [0, 82, 4], None))

T.append(('fullmakt-forsakringsarende-utokad', 'Fullmakt försäkringsärende utökad', 'ekonomi-myndigheter',
    'Utökad fullmakt för försäkringsärenden – flera bolag och produkter.',
    'Ger ombudet rätt att hantera alla dina försäkringar – hem, bil, liv, sjuk- och olycksfall – hos flera försäkringsbolag.',
    'gratis', 3450, 'financial', 'Försäkringsavtalslagen (2005:104).',
    ['fullmakt försäkring', 'fullmakt försäkringsbolag', 'försäkringsärende ombud'],
    [82, 27, 5], None))

# === ÖVRIGT (8) → digitalt-dodsbo ===
T.append(('fullmakt-begravningsonskemal', 'Begravningsönskemål', 'digitalt-dodsbo',
    'Skriftliga önskemål om din egen begravning.',
    'Skriftliga önskemål om begravningsform, ceremoni, gravplats och eventuella sånger eller texter. Inte juridiskt bindande men respekteras vanligen av anhöriga.',
    'popular', 5670, 'estate', 'Begravningslagen (1990:1144) reglerar begravning. Önskemål är ej bindande men har stark moralisk tyngd.',
    ['begravningsönskemål', 'fullmakt egen begravning', 'min begravning vilja'],
    [93, 94, 95], None))

T.append(('fullmakt-testamentsexekutor', 'Fullmakt testamentsexekutor', 'digitalt-dodsbo',
    'Utseende av testamentsexekutor som ska verkställa testamentet.',
    'Utser en testamentsexekutor (ofta advokat eller familjemedlem) som ansvarar för att förvalta dödsboet och verkställa testamentet enligt din vilja.',
    'premium', 2340, 'estate', 'Ärvdabalken (1958:637) 19 kap. om testamentsexekutor.',
    ['testamentsexekutor', 'fullmakt verkställa testamente', 'testamente exekutor'],
    [92, 94, 95], None))

T.append(('fullmakt-bouppteckningsforrattare', 'Fullmakt bouppteckningsförrättare', 'digitalt-dodsbo',
    'Utseende av bouppteckningsförrättare för dödsboet.',
    'Utser en bouppteckningsförrättare (ofta jurist eller revisor) som upprättar bouppteckningen för dödsboet och lämnar in den till Skatteverket.',
    'premium', 1670, 'estate', 'Ärvdabalken (1958:637) 20 kap. om bouppteckning.',
    ['bouppteckningsförrättare', 'fullmakt bouppteckning', 'fullmakt Skatteverket bouppteckning'],
    [93, 92, 95], None))

T.append(('fullmakt-donation-valgorenhet', 'Fullmakt donation välgörenhet', 'digitalt-dodsbo',
    'Fullmakt eller önskemål om donation till välgörenhet vid dödsfall.',
    'Skriftliga instruktioner om att del av kvarlåtenskapen ska gå till välgörenhet, alternativt fullmakt för anhörig att donera i ditt namn.',
    'gratis', 670, 'estate', 'Ärvdabalken (1958:637). Universella testamentstagare kan vara välgörenhetsorganisationer.',
    ['fullmakt donation', 'donera arv välgörenhet', 'fullmakt välgörenhet'],
    [92, 93, 95], None))

T.append(('fullmakt-konst-vardering-arvskifte', 'Fullmakt konstvärdering vid arvskifte', 'digitalt-dodsbo',
    'Fullmakt för värderingsman att värdera konst eller antikviteter inför arvskifte.',
    'Ger en auktoriserad värderingsman rätt att värdera konstverk, antikviteter eller andra dyrbarheter i dödsboet.',
    'gratis', 540, 'estate', 'Ärvdabalken (1958:637) 23 kap. om arvskifte.',
    ['fullmakt värdering konst', 'arvskifte värderingsman', 'fullmakt antikviteter'],
    [93, 94, 95], None))

T.append(('fullmakt-husdjur-dodsfall', 'Fullmakt husdjur vid dödsfall', 'digitalt-dodsbo',
    'Önskemål och fullmakt om vad som ska hända med husdjuren vid dödsfall.',
    'Specificerar vem som ska ta över husdjur, hur mycket pengar som avsätts för vård och eventuella veterinärinstruktioner.',
    'gratis', 1230, 'estate', 'Djurskyddslagen (2018:1192) och ärvdabalken (1958:637).',
    ['fullmakt husdjur dödsfall', 'husdjur vid dödsfall', 'fullmakt hund katt'],
    [92, 93, 97], None))

T.append(('fullmakt-begravningsbyra-ombud', 'Fullmakt begravningsbyrå', 'digitalt-dodsbo',
    'Fullmakt för anhörig att teckna avtal med begravningsbyrå.',
    'Ger ombudet rätt att teckna avtal med begravningsbyrå, välja kista, blommor, ceremoni och hantera fakturering. Bör utfärdas av samtliga dödsbodelägare.',
    'popular', 4560, 'estate', 'Begravningslagen (1990:1144).',
    ['fullmakt begravningsbyrå', 'begravningsbyrå ombud', 'fullmakt begravning ordna'],
    [50, 92, 93], None))

T.append(('fullmakt-andelar-samfallighet', 'Fullmakt andelar samfällighet', 'digitalt-dodsbo',
    'Fullmakt för andelsägare att rösta i samfällighetsföreningens stämma.',
    'Ger ombudet rätt att rösta åt dig vid samfällighetsföreningens stämma – vanligt vid gemensamhetsanläggningar (vägar, vatten, badplatser).',
    'gratis', 870, 'standard', 'Lag (1973:1150) om förvaltning av samfälligheter.',
    ['fullmakt samfällighet', 'samfällighetsförening stämma', 'andelsägare fullmakt'],
    [49, 2, 36], None))

# Verify count
assert len(T) == 100, f"Expected 100 templates, got {len(T)}"

# ─── Generate TS code ───
def ts_field(f):
    parts = [f"id: '{f['id']}'", f"label: '{f['label']}'", f"type: '{f['type']}'"]
    if 'placeholder' in f:
        parts.append(f"placeholder: '{f['placeholder']}'")
    if 'options' in f:
        opts = ', '.join(f"'{o}'" for o in f['options'])
        parts.append(f"options: [{opts}]")
    if f.get('required') is True:
        parts.append("required: true")
    elif f.get('required') is False:
        parts.append("required: false")
    if 'group' in f:
        parts.append(f"group: '{f['group']}'")
    return "{ " + ", ".join(parts) + " }"

def ts_template(tpl, id_):
    slug, name, cat_slug, desc, long_desc, badge, usage, arch, legal_specific, kw, related, custom_faqs = tpl
    cat_name = CATEGORIES[cat_slug]
    fields = ARCHETYPE_FIELDS[arch]()
    faqs = custom_faqs if custom_faqs else ARCHETYPE_FAQS[arch]
    legal = legal_specific if legal_specific else ARCHETYPE_LEGAL[arch]

    # Map related offsets (0-99 -> 137+offset)
    related_ids = [137 + r for r in related] if related else []

    field_lines = ',\n      '.join(ts_field(f) for f in fields)
    faq_lines = ',\n      '.join(f"{{ q: {json.dumps(q, ensure_ascii=False)}, a: {json.dumps(a, ensure_ascii=False)} }}" for q, a in faqs)
    kw_str = ', '.join(json.dumps(k, ensure_ascii=False) for k in kw)
    rel_str = ', '.join(str(r) for r in related_ids)

    return f"""  // {name}
  templates.push({{
    id: {id_},
    slug: '{slug}',
    name: {json.dumps(name, ensure_ascii=False)},
    category: {json.dumps(cat_name, ensure_ascii=False)},
    categorySlug: '{cat_slug}',
    description: {json.dumps(desc, ensure_ascii=False)},
    longDescription: {json.dumps(long_desc, ensure_ascii=False)},
    badge: '{badge}',
    usageCount: {usage},
    fields: [
      {field_lines},
    ],
    faq: [
      {faq_lines},
    ],
    relatedIds: [{rel_str}],
    legalInfo: {json.dumps(legal, ensure_ascii=False)},
    keywords: [{kw_str}],
  }} as Template);
"""

ts_blocks = []
for i, tpl in enumerate(T):
    ts_blocks.append(ts_template(tpl, 137 + i))

ts_insert = '\n  // ═══════════ NYA MALLAR 2026 (137–236) ═══════════\n\n' + '\n'.join(ts_blocks)

# Insert into data/templates.ts before the defensive dedup comment
with open(TEMPLATES_TS, 'r') as f:
    src = f.read()

ANCHOR = '  // Defensive dedup by slug — last write wins'
if ANCHOR not in src:
    raise SystemExit(f"Anchor not found in templates.ts: {ANCHOR}")
if "NYA MALLAR 2026 (137" in src:
    print("Templates already inserted; skipping TS modification.")
else:
    src = src.replace(ANCHOR, ts_insert + '\n' + ANCHOR)
    with open(TEMPLATES_TS, 'w') as f:
        f.write(src)
    print(f"Inserted {len(T)} templates into {TEMPLATES_TS}")

# ─── Generate JSON content files ───
def public_json(tpl, id_):
    slug, name, cat_slug, desc, long_desc, badge, usage, arch, legal_specific, kw, related, custom_faqs = tpl
    cat_name = CATEGORIES[cat_slug]
    fields = ARCHETYPE_FIELDS[arch]()
    faqs = custom_faqs if custom_faqs else ARCHETYPE_FAQS[arch]
    legal = legal_specific if legal_specific else ARCHETYPE_LEGAL[arch]
    related_ids = [137 + r for r in related] if related else []

    return {
        'id': id_,
        'slug': slug,
        'name': name,
        'category': cat_name,
        'categorySlug': cat_slug,
        'description': desc,
        'longDescription': long_desc,
        'badge': badge,
        'usageCount': usage,
        'fields': fields,
        'faq': [{'q': q, 'a': a} for q, a in faqs],
        'relatedIds': related_ids,
        'legalInfo': legal,
        'keywords': kw,
    }

def seo_json(tpl, id_):
    slug, name, cat_slug, desc, long_desc, badge, usage, arch, legal_specific, kw, related, custom_faqs = tpl
    cat_name = CATEGORIES[cat_slug]
    faqs = custom_faqs if custom_faqs else ARCHETYPE_FAQS[arch]
    legal = legal_specific if legal_specific else ARCHETYPE_LEGAL[arch]

    introduction = f"{long_desc}\n\nDenna mall är granskad av jurister och uppfyller svenska formkrav. Du kan skapa, ladda ner och dela ditt dokument som PDF på under 3 minuter."
    legal_validity = legal
    how_to = (
        f"Steg 1: Ange dina egna uppgifter som fullmaktsgivare – fullständigt namn, personnummer och adress.\n"
        f"Steg 2: Fyll i ombudets uppgifter och relation till dig.\n"
        f"Steg 3: Specificera uppdragets exakta omfattning – vara så detaljerad som möjligt.\n"
        f"Steg 4: Välj giltighetstid – för säkerhet rekommenderas en uttrycklig slutdatum.\n"
        f"Steg 5: Granska dokumentet i förhandsgranskningen och kontrollera att alla uppgifter stämmer.\n"
        f"Steg 6: Ladda ner som PDF, skriv under och låt gärna två vittnen underteckna för extra juridisk tyngd."
    )
    common_mistakes = (
        "1. För vag formulering – Banker, myndigheter och andra parter avvisar ofta fullmakter som är för generella. Beskriv exakt vad uppdraget omfattar.\n\n"
        "2. Glömmer personnummer – Båda parters fullständiga personnummer måste anges.\n\n"
        "3. Inget slutdatum – En fullmakt utan slutdatum kan skapa problem. Sätt alltid en tidsbegränsning.\n\n"
        "4. Glömmer bevittning – Även om det ofta inte är ett lagkrav stärker det dokumentets juridiska tyngd avsevärt.\n\n"
        "5. Glömmer återkallelse – När uppdraget är slutfört: meddela motparten skriftligt att fullmakten upphör."
    )

    return {
        'slug': slug,
        'seo': {
            'title': f'{name} – Mall & Guide 2026 | Fullmakt24.se',
            'metaDescription': f'{desc} Juridiskt granskad mall. Klar på 3 minuter. Ladda ner som PDF för 49 kr.',
            'h1': f'{name} – Mall & Guide 2026',
            'keywords': kw,
        },
        'content': {
            'introduction': introduction,
            'legalValidity': legal_validity,
            'howToGuide': how_to,
            'commonMistakes': common_mistakes,
            'faq': [{'question': q, 'answer': a} for q, a in faqs],
            'relatedSearchTerms': kw + [f'{name.lower()} pdf', f'{name.lower()} mall gratis'],
        },
        'schema': {
            'faqSchema': True,
            'howToSchema': True,
            'breadcrumbSchema': True,
        },
        'internalLinks': [
            {'text': 'Alla mallar', 'href': '/mallar'},
            {'text': f'Mallar i {cat_name}', 'href': f'/mallar?category={cat_slug}'},
        ],
        'lastUpdated': '2026-05-21',
    }

for i, tpl in enumerate(T):
    id_ = 137 + i
    slug = tpl[0]

    pub_path = PUBLIC_DIR / f"{slug}.json"
    with open(pub_path, 'w', encoding='utf-8') as f:
        json.dump(public_json(tpl, id_), f, ensure_ascii=False, indent=2)

    seo_path = CONTENT_DIR / f"{slug}.json"
    with open(seo_path, 'w', encoding='utf-8') as f:
        json.dump(seo_json(tpl, id_), f, ensure_ascii=False, indent=2)

print(f"Wrote {len(T) * 2} JSON files.")
print(f"Final: {len(T)} templates with ids 137-{137 + len(T) - 1}")
