import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Article, articles } from "./src/data/articles";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";
import AdminConsoleScreen from "./src/screens/AdminConsoleScreen";
import MemberConsoleScreen from "./src/screens/MemberConsoleScreen";
import ChatScreen from "./src/screens/ChatScreen";

const logo = require("./assets/logo.png");
const logoClean = require("./assets/logo_clean.png");
const header = require("./assets/header.png");

const COLORS = {
  bgMain: "#f4efe4",
  bgSection: "#efe4cf",
  bgCard: "#faf6ef",
  bgFeaturedCard: "#f8f2e7",
  bgInset: "#f8f4ed",
  textPrimary: "#3b2415",
  textBody: "#4a3728",
  textSecBody: "#4b3526",
  mutedBrown: "#8b6a43",
  primaryAccent: "#5b3419",
  darkAccent: "#3b2415",
  borderBrown: "#b38b59",
  lightBorder: "#d8c2a0",
  inputBorder: "#c8a97d",
  creamOnDark: "#f5ede0",
  mutedCreamOnDark: "#e7d6be",
  activeCategory: "#f3dfc0",
  white: "#ffffff",
  black: "#000000"
};

type Tab = "home" | "research" | "about" | "work" | "contact" | "account" | "chat";

const team = [
  {
    name: "Mr. Dhillon",
    role: "Strategic Research Director",
    desc: "Leads research initiatives, analytical studies, publications, and historical documentation.",
    qual: [
      "B.Voc, MSc CS, MTech Defence Tech, PhD Artificial Intelligence",
      "Community Leadership, Academic Writing & Fact Analysis"
    ]
  },
  {
    name: "Mr. Kaliraman",
    role: "Community & Operations Director",
    desc: "Oversees operations, outreach, organizational management, and community coordination.",
    qual: ["BA, MA Archaeology", "Public Outreach, Evidence Analysis, Community Gathering"]
  },
  {
    name: "Mr. Vashist",
    role: "Policy & Communications Director",
    desc: "Handles institutional communication, public messaging, outreach strategy, and policy coordination.",
    qual: [
      "BTech, MTech Defence Technology, PhD Artificial Intelligence",
      "Policy Communication, Public Relations & Community Coordination, Historical Document Analysis"
    ]
  }
];

const workDomains = [
  {
    title: "Historical Research",
    desc: "Ancient inscriptions, regional history, tribal continuity, linguistic evolution, social systems, migration patterns, and archival analysis."
  },
  {
    title: "Social Analysis",
    desc: "Research on social structure, cultural continuity, rural systems, traditions, demographics, and community-oriented discourse."
  },
  {
    title: "Technology & AI",
    desc: "Artificial intelligence, digital infrastructure, media systems, cyber awareness, data analysis, and defence-oriented technologies."
  },
  {
    title: "Legal & Policy Studies",
    desc: "Policy interpretation, constitutional research, governance systems, legal awareness, and social legislation."
  },
  {
    title: "Media & Communication",
    desc: "Content creation, public communication, design systems, documentaries, podcasts, and awareness campaigns."
  },
  {
    title: "Community Documentation",
    desc: "Oral histories, village-level documentation, cultural records, genealogies, local narratives, and preservation work."
  }
];

function Card({
  children,
  featured = false,
  dark = false,
  style
}: {
  children: React.ReactNode;
  featured?: boolean;
  dark?: boolean;
  style?: object;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: dark ? COLORS.primaryAccent : featured ? COLORS.bgFeaturedCard : COLORS.bgCard,
          borderColor: dark ? COLORS.primaryAccent : "rgba(179, 139, 89, 0.3)"
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

function TopAppBar() {
  return (
    <View style={styles.topBar}>
      <Image source={logoClean} style={styles.topLogo} resizeMode="contain" />
      <Text style={styles.topTitle}>Academia Khap</Text>
    </View>
  );
}

function NavButton({
  label,
  icon,
  active,
  onPress
}: {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.navButton} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.navIconCircle, active && styles.navIconCircleActive]}>
        <Text style={[styles.navIcon, active && styles.navIconActive]}>{icon}</Text>
      </View>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function BottomNav({
  activeTab,
  setActiveTab,
  showChat
}: {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  showChat: boolean;
}) {
  return (
    <View style={styles.bottomNav}>
      <NavButton icon="⌂" label="Home" active={activeTab === "home"} onPress={() => setActiveTab("home")} />
      <NavButton icon="▤" label="Research" active={activeTab === "research"} onPress={() => setActiveTab("research")} />
      <NavButton icon="◎" label="About" active={activeTab === "about"} onPress={() => setActiveTab("about")} />
      <NavButton icon="✦" label="Work" active={activeTab === "work"} onPress={() => setActiveTab("work")} />
      <NavButton icon="@" label="Contact" active={activeTab === "contact"} onPress={() => setActiveTab("contact")} />
      {showChat && (
        <NavButton icon="✉" label="Chat" active={activeTab === "chat"} onPress={() => setActiveTab("chat")} />
      )}
      <NavButton icon="⚙" label="Account" active={activeTab === "account"} onPress={() => setActiveTab("account")} />
    </View>
  );
}

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <Text style={[styles.sectionLabel, light && { color: COLORS.mutedCreamOnDark }]}>{children}</Text>;
}

function PrimaryButton({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.primaryButton} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.primaryButtonText}>{children}</Text>
    </TouchableOpacity>
  );
}

function HomeScreen({
  navigateTo
}: {
  navigateTo: (tab: Tab, article?: Article) => void;
}) {
  const topics = [
    "Research Papers",
    "Historical Analysis",
    "Social Dialogue",
    "Digital Awareness",
    "Community Documentation",
    "Books & Articles"
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ImageBackground source={header} style={styles.heroImage} resizeMode="cover">
        <View style={styles.heroOverlay}>
          <Image source={logo} style={styles.heroLogo} resizeMode="contain" />
        </View>
      </ImageBackground>

      <View style={styles.pageInner}>
        <View style={styles.centerBlock}>
          <SectionLabel>Research • History • Culture</SectionLabel>
          <Text style={styles.heroText}>
            A collective platform focused on evidence-based research, cultural continuity, social understanding,
            historical discourse, and intellectual engagement across communities.
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topicScroller}>
          {topics.map((topic) => (
            <View key={topic} style={styles.topicChip}>
              <Text style={styles.topicChipText}>{topic}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.sectionBand}>
          <SectionLabel>Publications & Posts</SectionLabel>
          <Text style={styles.sectionTitle}>Featured Research Topics</Text>
          {articles.map((article) => (
            <TouchableOpacity key={article.id} onPress={() => navigateTo("research", article)} activeOpacity={0.85}>
              <Card featured style={styles.articleCard}>
                <Text style={styles.cardCategory}>{article.category}</Text>
                <Text style={styles.cardTitle}>{article.title}</Text>
                <Text style={styles.cardBody}>{article.excerpt}</Text>
                <Text style={styles.readLink}>Read Article →</Text>
              </Card>
            </TouchableOpacity>
          ))}
          <PrimaryButton onPress={() => navigateTo("research")}>View All Posts</PrimaryButton>
        </View>

        <View>
          <SectionLabel>Community & Team</SectionLabel>
          <Card>
            <TouchableOpacity onPress={() => navigateTo("about")}>
              <Text style={styles.cardTitle}>Our Members →</Text>
            </TouchableOpacity>
            <Text style={styles.cardBody}>
              Academia Khap is built through collaboration between researchers, scholars, legal experts, educators,
              historians, and socially aware contributors dedicated to knowledge-based engagement.
            </Text>
            <View style={styles.wrapRow}>
              {["Research Scholars", "Doctorate Holders", "Legal Professionals", "Historians & Writers"].map((item) => (
                <Text key={item} style={styles.smallChip}>
                  {item}
                </Text>
              ))}
            </View>
          </Card>

          <Card dark style={styles.darkCardGap}>
            <TouchableOpacity onPress={() => navigateTo("work")}>
              <Text style={styles.darkTitle}>Work With Us →</Text>
            </TouchableOpacity>
            <Text style={styles.darkBody}>
              We welcome collaborations in research, digital publishing, historical documentation, translation, design,
              and social awareness projects.
            </Text>
            <View style={styles.wrapRow}>
              {["Writers & Editors", "Researchers", "Students", "Policy Analysts"].map((item) => (
                <Text key={item} style={styles.darkChip}>
                  {item}
                </Text>
              ))}
            </View>
          </Card>
        </View>

        <View style={styles.sectionBand}>
          <Text style={styles.sectionTitle}>Donations & Contributions</Text>
          <Text style={styles.cardBody}>
            Contributions help support independent research, publication of articles and books, archival work, digital
            awareness campaigns, educational initiatives, and preservation of historical and cultural knowledge.
          </Text>
          <Card style={styles.donationCard}>
            <Text style={styles.cardTitleSmall}>UPI / QR Payment</Text>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.mutedText}>QR placeholder</Text>
            </View>
            <Text style={styles.cardBody}>Account Name: Academia Khap</Text>
            <Text style={styles.cardBody}>Bank Name: [Your Bank Name]</Text>
            <Text style={styles.cardBody}>Account Number: XXXXXXXXXXXX</Text>
            <Text style={styles.cardBody}>IFSC Code: XXXXXXXX</Text>
          </Card>
        </View>

        <Card dark>
          <SectionLabel light>Get Connected</SectionLabel>
          <Text style={styles.darkTitleCentered}>Join Academia Khap</Text>
          <Text style={styles.darkBodyCentered}>
            Connect with us for research collaborations, social projects, publications, historical discussions,
            awareness campaigns, and community-oriented initiatives.
          </Text>
          <View style={styles.buttonStack}>
            <PrimaryButton onPress={() => Linking.openURL("https://www.youtube.com/@academiakhap")}>Youtube</PrimaryButton>
            <PrimaryButton onPress={() => Linking.openURL("https://www.instagram.com/khap.academia")}>Instagram</PrimaryButton>
            <PrimaryButton onPress={() => navigateTo("contact")}>Contact Us</PrimaryButton>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

function ResearchScreen({ initialArticle }: { initialArticle: Article | null }) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(initialArticle);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(
    () => articles.filter((article) => article.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  if (selectedArticle) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageInner}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedArticle(null)} activeOpacity={0.85}>
            <Text style={styles.backButtonText}>← Back to Archive</Text>
          </TouchableOpacity>
          <Text style={styles.detailCategory}>{selectedArticle.category}</Text>
          <Text style={styles.detailTitle}>{selectedArticle.title}</Text>
          {selectedArticle.content.map((block, index) =>
            block.type === "heading" ? (
              <Text key={`${block.text}-${index}`} style={styles.articleHeading}>
                {block.text}
              </Text>
            ) : (
              <Text key={`${block.text}-${index}`} style={styles.articleParagraph}>
                {block.text}
              </Text>
            )
          )}
          <Card>
            <Text style={styles.cardTitleSmall}>Evidence & Sources</Text>
            {selectedArticle.sources.map((source) => (
              <Text key={source} style={styles.sourceItem}>
                • {source}
              </Text>
            ))}
          </Card>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.pageInner}>
        <Text style={styles.screenTitle}>Research Archive</Text>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search articles..."
            placeholderTextColor={COLORS.mutedBrown}
            style={styles.searchInput}
          />
        </View>

        {filteredArticles.map((article) => (
          <TouchableOpacity key={article.id} onPress={() => setSelectedArticle(article)} activeOpacity={0.85}>
            <Card style={styles.articleCard}>
              <Text style={styles.cardCategory}>{article.category}</Text>
              <Text style={styles.cardTitle}>{article.title}</Text>
              <Text style={styles.cardBody}>{article.excerpt}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.pageInner}>
        <View style={styles.centerBlock}>
          <SectionLabel>Leadership & Team</SectionLabel>
          <Text style={styles.screenTitle}>Directors & Core Team</Text>
        </View>
        {team.map((member) => (
          <Card key={member.name} style={styles.articleCard}>
            <Text style={styles.cardTitle}>{member.name}</Text>
            <Text style={styles.roleText}>{member.role}</Text>
            <Text style={styles.cardBody}>{member.desc}</Text>
            <Text style={styles.cardTitleSmall}>Qualifications</Text>
            {member.qual.map((item) => (
              <Text key={item} style={styles.sourceItem}>
                • {item}
              </Text>
            ))}
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

function WorkScreen({ navigateTo }: { navigateTo: (tab: Tab) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.pageInner}>
        <View style={styles.centerBlock}>
          <SectionLabel>Collaborate With Academia Khap</SectionLabel>
          <Text style={styles.screenTitle}>Researchers, Scholars, Historians & Community Contributors</Text>
          <Text style={styles.heroText}>
            Academia Khap works through collaborative research, historical documentation, policy discussion, digital
            awareness, cultural preservation, and intellectual engagement across communities.
          </Text>
        </View>

        {workDomains.map((domain) => (
          <Card key={domain.title} style={styles.articleCard}>
            <Text style={styles.cardTitleSmall}>{domain.title}</Text>
            <Text style={styles.cardBody}>{domain.desc}</Text>
          </Card>
        ))}

        <Card dark>
          <Text style={styles.darkTitleCentered}>Join Academia Khap</Text>
          <Text style={styles.darkBodyCentered}>
            We are actively looking for contributors across research, documentation, media, and social analysis.
          </Text>
          <PrimaryButton onPress={() => navigateTo("contact")}>Contact Us</PrimaryButton>
        </Card>
      </View>
    </ScrollView>
  );
}

function ContactScreen() {
  const openEmail = () => {
    Linking.openURL("mailto:academiakhap@gmail.com?subject=Academia%20Khap%20Collaboration");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.pageInner}>
        <View style={styles.centerBlock}>
          <SectionLabel>Contact Academia Khap</SectionLabel>
          <Text style={styles.screenTitle}>Get In Touch</Text>
          <Text style={styles.heroText}>
            For collaborations, research discussions, institutional partnerships, legal consultation, historical
            documentation, publications, media engagement, or community initiatives, contact the Academia Khap team.
          </Text>
        </View>

        <Card>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <Text style={styles.cardTitleSmall}>General Email</Text>
          <Text style={styles.cardBody}>academiakhap@gmail.com</Text>
          <Text style={styles.cardTitleSmall}>Research & Publications</Text>
          <Text style={styles.cardBody}>research@academiakhap.org</Text>
          <Text style={styles.cardTitleSmall}>Collaborations</Text>
          <Text style={styles.cardBody}>partnerships@academiakhap.org</Text>
          <Text style={styles.cardTitleSmall}>Social Media</Text>
          <Text style={styles.cardBody}>Instagram: @academiakhap</Text>
          <Text style={styles.cardBody}>LinkedIn: Academia Khap</Text>
          <Text style={styles.cardTitleSmall}>Operational Region</Text>
          <Text style={styles.cardBody}>India • Community Research Network</Text>
        </Card>

        <Card dark>
          <Text style={styles.darkTitleCentered}>Send a Message</Text>
          <Text style={styles.darkBodyCentered}>Open your email app and send a message directly to Academia Khap.</Text>
          <PrimaryButton onPress={openEmail}>Email Academia Khap</PrimaryButton>
        </Card>
      </View>
    </ScrollView>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [initialArticle, setInitialArticle] = useState<Article | null>(null);
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!user && activeTab === "chat") {
      setActiveTab("account");
    }
  }, [user, activeTab]);

  const navigateTo = (tab: Tab, article?: Article) => {
    setActiveTab(tab);
    setInitialArticle(tab === "research" && article ? article : null);
  };

  const renderAccountScreen = () => {
    if (loading) {
      return (
        <View style={[styles.appBody, { alignItems: "center", justifyContent: "center" }]}>
          <ActivityIndicator color={COLORS.primaryAccent} />
        </View>
      );
    }
    if (!user) return <LoginScreen />;
    if (profile?.role === "admin") return <AdminConsoleScreen />;
    if (profile?.role === "member") return <MemberConsoleScreen />;
    return (
      <View style={[styles.appBody, { alignItems: "center", justifyContent: "center", padding: 24 }]}>
        <Text style={styles.cardBody}>
          Your account doesn't have a profile set up yet. Contact an Academia Khap admin.
        </Text>
      </View>
    );
  };

  const renderScreen = () => {
    if (activeTab === "home") return <HomeScreen navigateTo={navigateTo} />;
    if (activeTab === "research") return <ResearchScreen initialArticle={initialArticle} />;
    if (activeTab === "about") return <AboutScreen />;
    if (activeTab === "work") return <WorkScreen navigateTo={navigateTo} />;
    if (activeTab === "contact") return <ContactScreen />;
    if (activeTab === "account") return renderAccountScreen();
    if (activeTab === "chat") return user ? <ChatScreen /> : <LoginScreen />;
    return <ContactScreen />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="dark" backgroundColor={COLORS.bgSection} />
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgSection} />
      <TopAppBar />
      <View style={styles.appBody}>{renderScreen()}</View>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} showChat={Boolean(user)} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgMain
  },
  appBody: {
    flex: 1
  },
  topBar: {
    minHeight: 64,
    backgroundColor: COLORS.bgSection,
    borderBottomColor: "rgba(139, 106, 67, 0.2)",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16
  },
  topLogo: {
    width: 42,
    height: 42
  },
  topTitle: {
    color: COLORS.textPrimary,
    fontFamily: "serif",
    fontSize: 22,
    fontWeight: "700"
  },
  bottomNav: {
    minHeight: 76,
    backgroundColor: COLORS.bgSection,
    borderTopColor: "rgba(179, 139, 89, 0.3)",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 8,
    paddingBottom: 10
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 68
  },
  navIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center"
  },
  navIconCircleActive: {
    backgroundColor: "rgba(91, 52, 25, 0.12)"
  },
  navIcon: {
    color: COLORS.mutedBrown,
    fontSize: 20,
    fontWeight: "700"
  },
  navIconActive: {
    color: COLORS.primaryAccent
  },
  navLabel: {
    marginTop: 2,
    color: COLORS.mutedBrown,
    fontSize: 10,
    fontWeight: "700"
  },
  navLabelActive: {
    color: COLORS.primaryAccent
  },
  scrollContent: {
    paddingBottom: 28
  },
  heroImage: {
    width: "100%",
    height: 220
  },
  heroOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(59, 36, 21, 0.22)"
  },
  heroLogo: {
    width: 120,
    height: 120
  },
  pageInner: {
    padding: 16,
    gap: 22
  },
  centerBlock: {
    alignItems: "center",
    gap: 14
  },
  sectionLabel: {
    color: COLORS.mutedBrown,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textAlign: "center",
    textTransform: "uppercase"
  },
  heroText: {
    color: COLORS.textSecBody,
    fontFamily: "serif",
    fontSize: 18,
    lineHeight: 30,
    textAlign: "center"
  },
  topicScroller: {
    marginHorizontal: -16,
    paddingHorizontal: 16
  },
  topicChip: {
    backgroundColor: COLORS.white,
    borderColor: "rgba(179, 139, 89, 0.3)",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginRight: 10
  },
  topicChipText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700"
  },
  sectionBand: {
    backgroundColor: COLORS.bgSection,
    borderColor: "rgba(139, 106, 67, 0.2)",
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    gap: 16
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontFamily: "serif",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 38
  },
  screenTitle: {
    color: COLORS.textPrimary,
    fontFamily: "serif",
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 42,
    textAlign: "center"
  },
  card: {
    borderWidth: 1,
    borderRadius: 26,
    padding: 22
  },
  articleCard: {
    marginBottom: 14
  },
  cardCategory: {
    color: COLORS.mutedBrown,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    marginBottom: 10,
    textTransform: "uppercase"
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontFamily: "serif",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 31,
    marginBottom: 12
  },
  cardTitleSmall: {
    color: COLORS.textPrimary,
    fontFamily: "serif",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    marginBottom: 10,
    marginTop: 4
  },
  cardBody: {
    color: COLORS.textBody,
    fontFamily: "serif",
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 6
  },
  readLink: {
    color: COLORS.primaryAccent,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10
  },
  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8
  },
  smallChip: {
    backgroundColor: COLORS.bgInset,
    borderColor: COLORS.lightBorder,
    borderWidth: 1,
    borderRadius: 8,
    color: COLORS.textBody,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  darkCardGap: {
    marginTop: 16
  },
  darkTitle: {
    color: COLORS.white,
    fontFamily: "serif",
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 12
  },
  darkTitleCentered: {
    color: COLORS.white,
    fontFamily: "serif",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 14,
    textAlign: "center"
  },
  darkBody: {
    color: COLORS.creamOnDark,
    fontFamily: "serif",
    fontSize: 16,
    lineHeight: 26
  },
  darkBodyCentered: {
    color: COLORS.creamOnDark,
    fontFamily: "serif",
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 16,
    textAlign: "center"
  },
  darkChip: {
    borderColor: COLORS.mutedCreamOnDark,
    borderWidth: 1,
    borderRadius: 8,
    color: COLORS.mutedCreamOnDark,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  donationCard: {
    alignItems: "center"
  },
  qrPlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  mutedText: {
    color: COLORS.mutedBrown,
    fontSize: 13,
    textAlign: "center"
  },
  buttonStack: {
    gap: 10
  },
  primaryButton: {
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 18,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700"
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.bgSection,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8
  },
  backButtonText: {
    color: COLORS.primaryAccent,
    fontWeight: "700"
  },
  detailCategory: {
    color: COLORS.mutedBrown,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  detailTitle: {
    color: COLORS.textPrimary,
    fontFamily: "serif",
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 42,
    marginBottom: 10
  },
  articleHeading: {
    color: COLORS.textPrimary,
    fontFamily: "serif",
    fontSize: 25,
    fontWeight: "700",
    lineHeight: 33,
    marginTop: 20,
    marginBottom: 8
  },
  articleParagraph: {
    color: COLORS.textBody,
    fontFamily: "serif",
    fontSize: 17,
    lineHeight: 29,
    marginBottom: 10
  },
  sourceItem: {
    color: COLORS.textBody,
    fontFamily: "serif",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 7
  },
  searchBox: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.inputBorder,
    borderWidth: 1,
    borderRadius: 18,
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 4
  },
  searchIcon: {
    color: COLORS.mutedBrown,
    fontSize: 22,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16
  },
  roleText: {
    color: COLORS.primaryAccent,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10
  }
});
