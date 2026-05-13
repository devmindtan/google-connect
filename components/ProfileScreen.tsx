import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Mock data — chỉ hiện khi đăng nhập ẩn danh ─────────────────────────────
const MOCK_USER = {
  name: "Nguyễn Văn An",
  email: "demo@example.com",
  id: "1107995896533351578767",
  photo: null as string | null,
  givenName: "An",
  familyName: "Nguyễn Văn",
  idToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...mocktoken",
  serverAuthCode: null as string | null,
  scopes: ["openid", "profile", "email"],
};

type InfoRow = {
  label: string;
  value: string | null | undefined;
  sensitive?: boolean;
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // ── Phân biệt user thật vs mock ──────────────────────────────────────────
  // Data từ Google hiện được lưu là: { user: {...}, idToken, scopes, ... }
  const isReal = !!user;
  const realData = isReal ? (user as any) : null;
  const realUser = isReal ? (user as any)?.user : null;

  const displayUser = isReal
    ? {
        name: realUser?.name ?? "Không có tên",
        email: realUser?.email ?? "",
        photo: realUser?.photo ?? null,
        givenName: realUser?.givenName ?? "",
        familyName: realUser?.familyName ?? "",
        id: realUser?.id ?? "",
        idToken: realData?.idToken ?? "Chưa có token",
        serverAuthCode: realData?.serverAuthCode ?? "N/A",
        scopes: Array.isArray(realData?.scopes) ? realData.scopes : [],
      }
    : MOCK_USER;

  const infoRows: InfoRow[] = [
    { label: "Họ và tên", value: displayUser.name },
    { label: "Tên", value: displayUser.givenName },
    { label: "Họ", value: displayUser.familyName },
    { label: "Email", value: displayUser.email },
    { label: "ID", value: displayUser.id, sensitive: true },
    { label: "Auth Code", value: displayUser.serverAuthCode ?? "N/A", sensitive: true },
  ];

  const initials = displayUser.name
    .split(" ")
    .filter(Boolean)
    .map((w: string) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng xuất lúc này.");
      console.error(error);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: "#0D0D14" }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Banner cảnh báo nếu là guest ── */}
        {!isReal && (
          <View style={styles.mockBanner}>
            <Text style={styles.mockBannerText}>
              👤 Đang xem thử — Dữ liệu demo
            </Text>
          </View>
        )}

        {/* ── Avatar ── */}
        <View style={styles.heroSection}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              {displayUser.photo ? (
                <Image source={{ uri: displayUser.photo }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarInitials}>{initials}</Text>
              )}
            </View>
          </View>

          <View style={[styles.verifiedBadge, !isReal && styles.mockBadge]}>
            <Text style={[styles.verifiedText, !isReal && styles.mockBadgeText]}>
              {isReal ? "✓ Google" : "👤 Demo"}
            </Text>
          </View>

          <Text style={styles.heroName}>{displayUser.name}</Text>
          <Text style={styles.heroEmail}>{displayUser.email}</Text>
        </View>

        {/* ── Scopes ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quyền truy cập đã cấp</Text>
          <View style={styles.scopeRow}>
            {displayUser.scopes.map((s: string) => (
              <View key={s} style={styles.scopePill}>
                <Text style={styles.scopeText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Info rows ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Thông tin tài khoản</Text>
          <View style={styles.infoCard}>
            {infoRows.map((row, i) => (
              <View
                key={row.label}
                style={[styles.infoRow, i < infoRows.length - 1 && styles.infoRowBorder]}
              >
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text
                  style={[styles.infoValue, row.sensitive && styles.infoValueSensitive]}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {row.sensitive ? `${(row.value ?? "").slice(0, 16)}···` : row.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Token ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Token (ID Token)</Text>
          <View style={styles.tokenBox}>
            <Text style={styles.tokenText} numberOfLines={3} ellipsizeMode="tail">
              {displayUser.idToken}
            </Text>
          </View>
          <TouchableOpacity style={styles.copyBtn} activeOpacity={0.75}>
            <Text style={styles.copyBtnText}>📋  Sao chép token</Text>
          </TouchableOpacity>
        </View>

        {/* ── Actions ── */}
        <View style={styles.actionsSection}>
          {!isReal && (
            <TouchableOpacity
              style={styles.actionBtnGoogle}
              activeOpacity={0.85}
              onPress={() => router.replace("/")}
            >
              <Text style={styles.actionBtnGoogleText}>Đăng nhập với Google</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionBtnDanger}
            activeOpacity={0.75}
            onPress={isReal ? handleLogout : () => router.replace("/")}
          >
            <Text style={styles.actionBtnDangerText}>
              {isReal ? "Đăng xuất" : "Quay lại"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const BLUE = "#3B82F6";
const GLASS_BG = "rgba(255,255,255,0.055)";
const GLASS_BORDER = "rgba(255,255,255,0.10)";

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 22, paddingTop: 60, paddingBottom: 48 },

  orbTop: {
    position: "absolute", top: -100, right: -80,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: "rgba(59,130,246,0.13)",
  },
  orbBottom: {
    position: "absolute", bottom: -80, left: -60,
    width: 240, height: 240, borderRadius: 120,
    backgroundColor: "rgba(99,102,241,0.10)",
  },

  mockBanner: {
    backgroundColor: "rgba(234,179,8,0.12)",
    borderWidth: 1, borderColor: "rgba(234,179,8,0.25)",
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16,
    marginBottom: 24, alignItems: "center",
  },
  mockBannerText: { fontSize: 13, color: "#FDE047", fontWeight: "600" },

  heroSection: { alignItems: "center", marginBottom: 36 },
  avatarRing: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 2, borderColor: BLUE,
    alignItems: "center", justifyContent: "center", marginBottom: 12,
    shadowColor: BLUE, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 12,
  },
  avatarInner: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: "#1E3A5F",
    alignItems: "center", justifyContent: "center", overflow: "hidden",
  },
  avatarImg: { width: 88, height: 88 },
  avatarInitials: { fontSize: 32, fontWeight: "800", color: "#93C5FD" },
  verifiedBadge: {
    backgroundColor: "rgba(34,197,94,0.15)",
    borderWidth: 1, borderColor: "rgba(34,197,94,0.3)",
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 12,
  },
  mockBadge: {
    backgroundColor: "rgba(234,179,8,0.12)",
    borderColor: "rgba(234,179,8,0.3)",
  },
  verifiedText: { fontSize: 11.5, fontWeight: "700", color: "#4ADE80", letterSpacing: 0.5 },
  mockBadgeText: { color: "#FDE047" },
  heroName: { fontSize: 24, fontWeight: "800", color: "#F1F5F9", marginBottom: 4 },
  heroEmail: { fontSize: 14, color: "#64748B" },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 11, fontWeight: "700", color: "#475569",
    letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 12,
  },

  scopeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  scopePill: {
    backgroundColor: "rgba(59,130,246,0.12)", borderRadius: 20,
    borderWidth: 1, borderColor: "rgba(59,130,246,0.25)",
    paddingHorizontal: 14, paddingVertical: 6,
  },
  scopeText: { fontSize: 12.5, fontWeight: "600", color: "#93C5FD" },

  infoCard: {
    backgroundColor: GLASS_BG, borderRadius: 18,
    borderWidth: 1, borderColor: GLASS_BORDER, overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingHorizontal: 18, paddingVertical: 15,
  },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  infoLabel: { fontSize: 13, color: "#64748B", fontWeight: "500", flex: 1 },
  infoValue: { fontSize: 13.5, color: "#CBD5E1", fontWeight: "600", flex: 2, textAlign: "right" },
  infoValueSensitive: { color: "#475569", fontFamily: "monospace" },

  tokenBox: {
    backgroundColor: "rgba(15,23,42,0.8)", borderRadius: 12,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
    padding: 14, marginBottom: 10,
  },
  tokenText: { fontSize: 11.5, color: "#475569", fontFamily: "monospace", lineHeight: 18 },
  copyBtn: {
    alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: 10, backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1, borderColor: GLASS_BORDER,
  },
  copyBtnText: { fontSize: 13, color: "#94A3B8", fontWeight: "600" },

  actionsSection: { gap: 12, marginTop: 4 },
  actionBtnGoogle: {
    backgroundColor: BLUE, borderRadius: 16, paddingVertical: 16, alignItems: "center",
    shadowColor: BLUE, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 14, elevation: 8,
  },
  actionBtnGoogleText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  actionBtnDanger: {
    borderRadius: 16, paddingVertical: 16, alignItems: "center",
    borderWidth: 1, borderColor: "rgba(239,68,68,0.25)",
    backgroundColor: "rgba(239,68,68,0.07)",
  },
  actionBtnDangerText: { fontSize: 15, fontWeight: "600", color: "#F87171" },
});