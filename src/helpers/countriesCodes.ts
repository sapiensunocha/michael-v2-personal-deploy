const countryCodes = [
  { value: "+1", label: "🇨🇦 +1 (CAN)" },
  { value: "+93", label: "🇦🇫 +93 (AFG)" },
  { value: "+355", label: "🇦🇱 +355 (ALB)" },
  { value: "+213", label: "🇩🇿 +213 (DZA)" },
  { value: "+376", label: "🇦🇩 +376 (AND)" },
  { value: "+244", label: "🇦🇴 +244 (AGO)" },
  { value: "+54", label: "🇦🇷 +54 (ARG)" },
  { value: "+374", label: "🇦🇲 +374 (ARM)" },
  { value: "+61", label: "🇦🇺 +61 (AUS)" },
  { value: "+43", label: "🇦🇹 +43 (AUT)" },
  { value: "+994", label: "🇦🇿 +994 (AZE)" },
  { value: "+973", label: "🇧🇭 +973 (BHR)" },
  { value: "+880", label: "🇧🇩 +880 (BGD)" },
  { value: "+375", label: "🇧🇾 +375 (BLR)" },
  { value: "+32", label: "🇧🇪 +32 (BEL)" },
  { value: "+501", label: "🇧🇿 +501 (BLZ)" },
  { value: "+229", label: "🇧🇯 +229 (BEN)" },
  { value: "+975", label: "🇧🇹 +975 (BTN)" },
  { value: "+591", label: "🇧🇴 +591 (BOL)" },
  { value: "+387", label: "🇧🇦 +387 (BIH)" },
  { value: "+267", label: "🇧🇼 +267 (BWA)" },
  { value: "+55", label: "🇧🇷 +55 (BRA)" },
  { value: "+673", label: "🇧🇳 +673 (BRN)" },
  { value: "+359", label: "🇧🇬 +359 (BGR)" },
  { value: "+226", label: "🇧🇫 +226 (BFA)" },
  { value: "+257", label: "🇧🇮 +257 (BDI)" },
  { value: "+57", label: "🇨🇴 +57 (COL)" },
  { value: "+855", label: "🇰🇭 +855 (KHM)" },
  { value: "+237", label: "🇨🇲 +237 (CMR)" },
  { value: "+238", label: "🇨🇻 +238 (CPV)" },
  { value: "+236", label: "🇨🇫 +236 (CAF)" },
  { value: "+235", label: "🇹🇩 +235 (TCD)" },
  { value: "+56", label: "🇨🇱 +56 (CHL)" },
  { value: "+86", label: "🇨🇳 +86 (CHN)" },
  { value: "+269", label: "🇰🇲 +269 (COM)" },
  { value: "+242", label: "🇨🇬 +242 (COG)" },
  { value: "+243", label: "🇨🇩 +243 (COD)" },
  { value: "+506", label: "🇨🇷 +506 (CRI)" },
  { value: "+385", label: "🇭🇷 +385 (HRV)" },
  { value: "+53", label: "🇨🇺 +53 (CUB)" },
  { value: "+357", label: "🇨🇾 +357 (CYP)" },
  { value: "+420", label: "🇨🇿 +420 (CZE)" },
  { value: "+45", label: "🇩🇰 +45 (DNK)" },
  { value: "+253", label: "🇩🇯 +253 (DJI)" },
  { value: "+1", label: "🇩🇲 +1 (DMA)" },
  { value: "+593", label: "🇪🇨 +593 (ECU)" },
  { value: "+20", label: "🇪🇬 +20 (EGY)" },
  { value: "+503", label: "🇸🇻 +503 (SLV)" },
  { value: "+372", label: "🇪🇪 +372 (EST)" },
  { value: "+251", label: "🇪🇹 +251 (ETH)" },
  { value: "+358", label: "🇫🇮 +358 (FIN)" },
  { value: "+33", label: "🇫🇷 +33 (FRA)" },
  { value: "+995", label: "🇬🇪 +995 (GEO)" },
  { value: "+49", label: "🇩🇪 +49 (DEU)" },
  { value: "+30", label: "🇬🇷 +30 (GRC)" },
  { value: "+852", label: "🇭🇰 +852 (HKG)" },
  { value: "+36", label: "🇭🇺 +36 (HUN)" },
  { value: "+354", label: "🇮🇸 +354 (ISL)" },
  { value: "+91", label: "🇮🇳 +91 (IND)" },
  { value: "+62", label: "🇮🇩 +62 (IDN)" },
  { value: "+98", label: "🇮🇷 +98 (IRN)" },
  { value: "+964", label: "🇮🇶 +964 (IRQ)" },
  { value: "+353", label: "🇮🇪 +353 (IRL)" },
  { value: "+972", label: "🇮🇱 +972 (ISR)" },
  { value: "+39", label: "🇮🇹 +39 (ITA)" },
  { value: "+81", label: "🇯🇵 +81 (JPN)" },
  { value: "+962", label: "🇯🇴 +962 (JOR)" },
  { value: "+7", label: "🇷🇺 +7 (RUS)" },
  { value: "+250", label: "🇷🇼 +250 (RW)" },
  { value: "+966", label: "🇸🇦 +966 (SAU)" },
  { value: "+27", label: "🇿🇦 +27 (ZAF)" },
  { value: "+34", label: "🇪🇸 +34 (ESP)" },
  { value: "+46", label: "🇸🇪 +46 (SWE)" },
  { value: "+41", label: "🇨🇭 +41 (CHE)" },
  { value: "+66", label: "🇹🇭 +66 (THA)" },
  { value: "+90", label: "🇹🇷 +90 (TUR)" },
  { value: "+380", label: "🇺🇦 +380 (UKR)" },
  { value: "+44", label: "🇬🇧 +44 (GBR)" },
  { value: "+1", label: "🇺🇸 +1 (USA)" },
  { value: "+58", label: "🇻🇪 +58 (VEN)" },
  { value: "+84", label: "🇻🇳 +84 (VNM)" },
  { value: "+263", label: "🇿🇼 +263 (ZWE)" },
  { value: "+31", label: "🇳🇱 +31 (NLD)" }, // Netherlands
  { value: "+351", label: "🇵🇹 +351 (PRT)" }, // Portugal
  { value: "+48", label: "🇵🇱 +48 (POL)" }, // Poland
  { value: "+47", label: "🇳🇴 +47 (NOR)" }, // Norway
  { value: "+40", label: "🇷🇴 +40 (ROU)" }, // Romania
  { value: "+381", label: "🇷🇸 +381 (SRB)" }, // Serbia
  { value: "+382", label: "🇲🇪 +382 (MNE)" }, // Montenegro
  { value: "+373", label: "🇲🇩 +373 (MDA)" }, // Moldova
  { value: "+371", label: "🇱🇻 +371 (LVA)" }, // Latvia
  { value: "+370", label: "🇱🇹 +370 (LTU)" }, // Lithuania
  { value: "+82", label: "🇰🇷 +82 (KOR)" }, // South Korea
  { value: "+92", label: "🇵🇰 +92 (PAK)" }, // Pakistan
  { value: "+94", label: "🇱🇰 +94 (LKA)" }, // Sri Lanka
  { value: "+977", label: "🇳🇵 +977 (NPL)" }, // Nepal
  { value: "+95", label: "🇲🇲 +95 (MMR)" }, // Myanmar
  { value: "+856", label: "🇱🇦 +856 (LAO)" }, // Laos
  { value: "+60", label: "🇲🇾 +60 (MYS)" }, // Malaysia
  { value: "+65", label: "🇸🇬 +65 (SGP)" }, // Singapore
  { value: "+63", label: "🇵🇭 +63 (PHL)" }, // Philippines
  { value: "+64", label: "🇳🇿 +64 (NZL)" }, // New Zealand
  { value: "+212", label: "🇲🇦 +212 (MAR)" }, // Morocco
  { value: "+216", label: "🇹🇳 +216 (TUN)" }, // Tunisia
  { value: "+254", label: "🇰🇪 +254 (KEN)" }, // Kenya
  { value: "+234", label: "🇳🇬 +234 (NGA)" }, // Nigeria
  { value: "+233", label: "🇬🇭 +233 (GHA)" }, // Ghana
  { value: "+221", label: "🇸🇳 +221 (SEN)" }, // Senegal
  { value: "+225", label: "🇨🇮 +225 (CIV)" }, // Côte d'Ivoire
  { value: "+261", label: "🇲🇬 +261 (MDG)" }, // Madagascar
  { value: "+52", label: "🇲🇽 +52 (MEX)" }, // Mexico
  { value: "+507", label: "🇵🇦 +507 (PAN)" }, // Panama
  { value: "+502", label: "🇬🇹 +502 (GTM)" }, // Guatemala
  { value: "+504", label: "🇭🇳 +504 (HND)" }, // Honduras
  { value: "+505", label: "🇳🇮 +505 (NIC)" }, // Nicaragua
  { value: "+1-876", label: "🇯🇲 +1-876 (JAM)" }, // Jamaica
  { value: "+1-868", label: "🇹🇹 +1-868 (TTO)" }, // Trinidad and Tobago
  { value: "+1-246", label: "🇧🇧 +1-246 (BRB)" }, // Barbados
  { value: "+1-242", label: "🇧🇸 +1-242 (BHS)" }, // Bahamas
  { value: "+223", label: "🇲🇱 +223 (MLI)" }, // Mali
  { value: "+230", label: "🇲🇺 +230 (MUS)" }, // Mauritius
  { value: "+248", label: "🇸🇨 +248 (SYC)" }, // Seychelles
  { value: "+266", label: "🇱🇸 +266 (LSO)" }, // Lesotho
  { value: "+268", label: "🇸🇿 +268 (SWZ)" }, // Eswatini
  { value: "+685", label: "🇼🇸 +685 (WSM)" }, // Samoa
  { value: "+679", label: "🇫🇯 +679 (FJI)" }, // Fiji
  { value: "+676", label: "🇹🇴 +676 (TON)" }, // Tonga
  { value: "+677", label: "🇸🇧 +677 (SLB)" }, // Solomon Islands
  { value: "+678", label: "🇻🇺 +678 (VUT)" }, // Vanuatu
  { value: "+686", label: "🇰🇮 +686 (KIR)" }, // Kiribati
  { value: "+692", label: "🇲🇭 +692 (MHL)" }, // Marshall Islands
  { value: "+680", label: "🇵🇼 +680 (PLW)" }, // Palau
  { value: "+691", label: "🇫🇲 +691 (FSM)" }, // Micronesia
  { value: "+961", label: "🇱🇧 +961 (LBN)" }, // Lebanon
  { value: "+965", label: "🇰🇼 +965 (KWT)" }, // Kuwait
  { value: "+968", label: "🇴🇲 +968 (OMN)" }, // Oman
  { value: "+974", label: "🇶🇦 +974 (QAT)" }, // Qatar
  { value: "+971", label: "🇦🇪 +971 (ARE)" }, // United Arab Emirates
  { value: "+421", label: "🇸🇰 +421 (SVK)" }, // Slovakia
  { value: "+352", label: "🇱🇺 +352 (LUX)" }, // Luxembourg
  { value: "+992", label: "🇹🇯 +992 (TJK)" }, // Tajikistan
  { value: "+993", label: "🇹🇲 +993 (TKM)" }, // Turkmenistan
  { value: "+998", label: "🇺🇿 +998 (UZB)" }, // Uzbekistan
  { value: "+996", label: "🇰🇬 +996 (KGZ)" }, // Kyrgyzstan
  { value: "+218", label: "🇱🇾 +218 (LBY)" }, // Libya
  { value: "+255", label: "🇹🇿 +255 (TZA)" }, // Tanzania
  { value: "+256", label: "🇺🇬 +256 (UGA)" }, // Uganda
  { value: "+252", label: "🇸🇴 +252 (SOM)" }, // Somalia
  { value: "+258", label: "🇲🇿 +258 (MOZ)" }, // Mozambique
  { value: "+264", label: "🇳🇦 +264 (NAM)" }, // Namibia
  { value: "+241", label: "🇬🇦 +241 (GAB)" }, // Gabon
  { value: "+249", label: "🇸🇩 +249 (SDN)" }, // Sudan
  { value: "+227", label: "🇳🇪 +227 (NER)" }, // Niger
  { value: "+509", label: "🇭🇹 +509 (HTI)" }, // Haiti
  { value: "+51", label: "🇵🇪 +51 (PER)" }, // Peru
  { value: "+598", label: "🇺🇾 +598 (URY)" }, // Uruguay
  { value: "+595", label: "🇵🇾 +595 (PRY)" }, // Paraguay
  { value: "+592", label: "🇬🇾 +592 (GUY)" }, // Guyana
  { value: "+597", label: "🇸🇷 +597 (SUR)" }, // Suriname
  { value: "+378", label: "🇸🇲 +378 (SMR)" }, // San Marino
  { value: "+379", label: "🇻🇦 +379 (VAT)" }, // Vatican City
  { value: "+377", label: "🇲🇨 +377 (MCO)" }, // Monaco
  { value: "+423", label: "🇱🇮 +423 (LIE)" }, // Liechtenstein
  { value: "+356", label: "🇲🇹 +356 (MLT)" }, // Malta
];

export default countryCodes;
