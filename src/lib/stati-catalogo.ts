export type GruppoStati = {
  label: string
  tipologia: 'lungo-raggio' | 'medio-raggio' | 'italia-mare' | 'crociere'
  stati: string[]
}

export const STATI_CATALOGO: GruppoStati[] = [
  {
    label: 'Lungo Raggio',
    tipologia: 'lungo-raggio',
    stati: [
      // Africa australe e Oceano Indiano
      'Sudafrica', 'Namibia', 'Botswana', 'Lesotho', 'Swaziland (eSwatini)', 'Zimbabwe',
      'Malawi', 'Madagascar', 'Mauritius', 'Seychelles', 'Comore',
      // Oceania
      'Australia', 'Nuova Zelanda', 'Figi', 'Isole Salomone', 'Samoa', 'Tonga', 'Isole Marshall',
      // America del Sud
      'Argentina', 'Bolivia', 'Brasile', 'Cile', 'Colombia', 'Ecuador', 'Guyana',
      'Paraguay', 'Perù', 'Suriname', 'Uruguay', 'Venezuela',
      // Caraibi e America del Nord/Centrale
      'Antigua e Barbuda', 'Bahamas', 'Barbados', 'Cuba', 'Dominica', 'Grenada',
      'Giamaica', 'Repubblica Dominicana', 'Saint Kitts e Nevis', 'Saint Vincent e Grenadine',
      'Santa Lucia', 'Trinidad e Tobago', 'Isole Vergini Americane', 'Isole Vergini Britanniche',
      'Martinica', 'USA', 'Messico', 'Canada',
      // Asia e Medio Oriente
      'Arabia Saudita', 'Azerbaigian', 'Bahrein', 'Bangladesh', 'Bhutan', 'Brunei',
      'Cambogia', 'Cina', 'Cipro', 'Corea del Sud', 'Emirati Arabi', 'Filippine',
      'Giappone', 'Giordania', 'India', 'Indonesia', 'Israele', 'Kazakistan', 'Laos',
      'Libano', 'Malaysia', 'Maldive', 'Mongolia', 'Myanmar (Birmania)', 'Nepal',
      'Oman', 'Palestina', 'Qatar', 'Singapore', 'Sri Lanka', 'Siria', 'Taiwan',
      'Thailandia', 'Uzbekistan', 'Vietnam',
    ],
  },
  {
    label: 'Medio Raggio',
    tipologia: 'medio-raggio',
    stati: [
      'Albania', 'Austria', 'Cipro', 'Croazia', 'Danimarca', 'Estonia', 'Finlandia',
      'Francia', 'Germania', 'Grecia', 'Irlanda', 'Islanda', 'Lettonia', 'Lituania',
      'Lussemburgo', 'Malta', 'Monaco', 'Montenegro', 'Norvegia', 'Paesi Bassi',
      'Polonia', 'Portogallo', 'Regno Unito', 'Repubblica Ceca', 'Romania', 'Slovacchia',
      'Slovenia', 'Spagna', 'Svezia', 'Svizzera', 'Ucraina', 'Ungheria',
      'Russia', 'Turchia',
      'Algeria', 'Egitto', 'Marocco', 'Tunisia',
    ],
  },
  {
    label: 'Italia Mare',
    tipologia: 'italia-mare',
    stati: [
      'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia Romagna',
      'Friuli Venezia Giulia', 'Lazio', 'Liguria', 'Marche', 'Molise',
      'Puglia', 'Sardegna', 'Sicilia', 'Toscana', 'Veneto',
    ],
  },
  {
    label: 'Crociere',
    tipologia: 'crociere',
    stati: [
      'Giro del Mondo',
      'Nord Europa (Fiordi, Capitali Baltiche, Islanda)',
      'Mediterraneo Orientale (Grecia, Turchia, Croazia)',
      'Mediterraneo Occidentale (Barcellona, Marsiglia, Genova)',
      'Caraibi e Antille',
      'Altre Destinazioni (Alaska, Sud America, Asia, Canale di Panama)',
    ],
  },
]

export const TUTTI_GLI_STATI = STATI_CATALOGO.flatMap(g => g.stati)
