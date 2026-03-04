import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type KK = {
    id : Nat;
    nomorKK : Text;
    namaKepala : Text;
    alamat : Text;
    blokRumah : Text;
    noHP : Text;
    createdAt : Int;
  };

  module KK {
    public func compare(kk1 : KK, kk2 : KK) : Order.Order {
      Nat.compare(kk1.id, kk2.id);
    };
  };

  type Warga = {
    id : Nat;
    kkId : Nat;
    nik : Text;
    namaLengkap : Text;
    tempatLahir : Text;
    tanggalLahir : Text;
    jenisKelamin : Text;
    hubunganKK : Text;
    statusAktif : Bool;
    createdAt : Int;
  };

  module Warga {
    public func compare(warga1 : Warga, warga2 : Warga) : Order.Order {
      Nat.compare(warga1.id, warga2.id);
    };
  };

  type Iuran = {
    id : Nat;
    kkId : Nat;
    bulan : Nat;
    tahun : Nat;
    jumlah : Nat;
    statusLunas : Bool;
    tanggalBayar : Text;
    keterangan : Text;
    createdAt : Int;
  };

  module Iuran {
    public func compare(iuran1 : Iuran, iuran2 : Iuran) : Order.Order {
      Nat.compare(iuran1.id, iuran2.id);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  type AdminCredentials = {
    username : Text;
    passwordHash : Text;
  };

  // Internal state
  let kks = Map.empty<Nat, KK>();
  let wargas = Map.empty<Nat, Warga>();
  let iurans = Map.empty<Nat, Iuran>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let sessions = Map.empty<Text, Principal>();

  var nextId : Nat = 1;
  var adminCredentials : ?AdminCredentials = null;

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public shared ({ caller }) func setAdminCredentials(username : Text, passwordHash : Text) : async () {
    // Only allow setting credentials if none exist OR caller is admin
    switch (adminCredentials) {
      case (null) {
        // First time setup - anyone can set (typically the deployer)
      };
      case (?_) {
        // Credentials already exist - only admin can change
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
          Runtime.trap("Unauthorized: Only admin can change credentials");
        };
      };
    };

    adminCredentials := ?{
      username;
      passwordHash;
    };
  };

  // Authentication - public, no authorization needed
  public shared ({ caller }) func loginWithCredentials(username : Text, passwordHash : Text, token : Text) : async ?Text {
    let creds = switch (adminCredentials) {
      case (null) { return null };
      case (?c) { c };
    };

    if (Text.equal(username, creds.username) and Text.equal(passwordHash, creds.passwordHash)) {
      sessions.add(token, caller);
      ?token;
    } else {
      null;
    };
  };

  public query ({ caller }) func validateSession(token : Text) : async Bool {
    sessions.containsKey(token);
  };

  public shared ({ caller }) func logoutSession(token : Text) : async () {
    // Verify the caller owns this session token
    switch (sessions.get(token)) {
      case (null) {
        // Token doesn't exist - silently succeed
      };
      case (?owner) {
        if (caller != owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only logout your own session");
        };
        sessions.remove(token);
      };
    };
  };

  public query ({ caller }) func getAdminUsername() : async ?Text {
    // Require at least user-level authentication to view admin username
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view admin username");
    };

    switch (adminCredentials) {
      case (null) { null };
      case (?creds) { ?creds.username };
    };
  };

  // User Profile Operations
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // KK Operations
  public shared ({ caller }) func createKK(nomorKK : Text, namaKepala : Text, alamat : Text, blokRumah : Text, noHP : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let id = nextId;
    nextId += 1;

    let kk : KK = {
      id;
      nomorKK;
      namaKepala;
      alamat;
      blokRumah;
      noHP;
      createdAt = Time.now();
    };

    kks.add(id, kk);
    id;
  };

  public shared ({ caller }) func updateKK(id : Nat, nomorKK : Text, namaKepala : Text, alamat : Text, blokRumah : Text, noHP : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (kks.get(id)) {
      case (null) { Runtime.trap("KK not found") };
      case (?existing) {
        let updated : KK = {
          id;
          nomorKK;
          namaKepala;
          alamat;
          blokRumah;
          noHP;
          createdAt = existing.createdAt;
        };
        kks.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteKK(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not kks.containsKey(id)) {
      Runtime.trap("KK not found");
    };
    kks.remove(id);
  };

  public query ({ caller }) func getKKById(id : Nat) : async KK {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view data");
    };

    switch (kks.get(id)) {
      case (null) { Runtime.trap("KK not found") };
      case (?kk) { kk };
    };
  };

  public query ({ caller }) func getAllKK() : async [KK] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view data");
    };

    kks.values().toArray().sort();
  };

  // Warga Operations
  public shared ({ caller }) func createWarga(kkId : Nat, nik : Text, namaLengkap : Text, tempatLahir : Text, tanggalLahir : Text, jenisKelamin : Text, hubunganKK : Text, statusAktif : Bool) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not kks.containsKey(kkId)) {
      Runtime.trap("KK not found");
    };

    let id = nextId;
    nextId += 1;

    let warga : Warga = {
      id;
      kkId;
      nik;
      namaLengkap;
      tempatLahir;
      tanggalLahir;
      jenisKelamin;
      hubunganKK;
      statusAktif;
      createdAt = Time.now();
    };

    wargas.add(id, warga);
    id;
  };

  public shared ({ caller }) func updateWarga(id : Nat, kkId : Nat, nik : Text, namaLengkap : Text, tempatLahir : Text, tanggalLahir : Text, jenisKelamin : Text, hubunganKK : Text, statusAktif : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (wargas.get(id)) {
      case (null) { Runtime.trap("Warga not found") };
      case (?existing) {
        let updated : Warga = {
          id;
          kkId;
          nik;
          namaLengkap;
          tempatLahir;
          tanggalLahir;
          jenisKelamin;
          hubunganKK;
          statusAktif;
          createdAt = existing.createdAt;
        };
        wargas.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteWarga(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not wargas.containsKey(id)) {
      Runtime.trap("Warga not found");
    };
    wargas.remove(id);
  };

  public query ({ caller }) func getWargaById(id : Nat) : async Warga {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view data");
    };

    switch (wargas.get(id)) {
      case (null) { Runtime.trap("Warga not found") };
      case (?warga) { warga };
    };
  };

  public query ({ caller }) func getAllWarga() : async [Warga] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view data");
    };

    wargas.values().toArray().sort();
  };

  public query ({ caller }) func getWargaByKKId(kkId : Nat) : async [Warga] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view data");
    };

    wargas.values().toArray().sort().filter(
      func(w) { Nat.compare(w.kkId, kkId) == #equal }
    );
  };

  // Iuran Operations
  public shared ({ caller }) func createIuran(kkId : Nat, bulan : Nat, tahun : Nat, jumlah : Nat, statusLunas : Bool, tanggalBayar : Text, keterangan : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not kks.containsKey(kkId)) {
      Runtime.trap("KK not found");
    };

    let id = nextId;
    nextId += 1;

    let iuran : Iuran = {
      id;
      kkId;
      bulan;
      tahun;
      jumlah;
      statusLunas;
      tanggalBayar;
      keterangan;
      createdAt = Time.now();
    };

    iurans.add(id, iuran);
    id;
  };

  public shared ({ caller }) func updateIuran(id : Nat, kkId : Nat, bulan : Nat, tahun : Nat, jumlah : Nat, statusLunas : Bool, tanggalBayar : Text, keterangan : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (iurans.get(id)) {
      case (null) { Runtime.trap("Iuran not found") };
      case (?existing) {
        let updated : Iuran = {
          id;
          kkId;
          bulan;
          tahun;
          jumlah;
          statusLunas;
          tanggalBayar;
          keterangan;
          createdAt = existing.createdAt;
        };
        iurans.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteIuran(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not iurans.containsKey(id)) {
      Runtime.trap("Iuran not found");
    };
    iurans.remove(id);
  };

  public query ({ caller }) func getIuranById(id : Nat) : async Iuran {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view data");
    };

    switch (iurans.get(id)) {
      case (null) { Runtime.trap("Iuran not found") };
      case (?iuran) { iuran };
    };
  };

  public query ({ caller }) func getAllIuran() : async [Iuran] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view data");
    };

    iurans.values().toArray().sort();
  };

  public query ({ caller }) func getIuranByKKId(kkId : Nat) : async [Iuran] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view data");
    };

    iurans.values().toArray().sort().filter(
      func(i) { Nat.compare(i.kkId, kkId) == #equal }
    );
  };

  public query ({ caller }) func getIuranByBulanTahun(bulan : Nat, tahun : Nat) : async [Iuran] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view data");
    };

    iurans.values().toArray().sort().filter(
      func(i) { Nat.compare(i.bulan, bulan) == #equal and Nat.compare(i.tahun, tahun) == #equal }
    );
  };

  // Stats Queries - Require user authentication
  public query ({ caller }) func getTotalKK() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view statistics");
    };

    kks.size();
  };

  public query ({ caller }) func getTotalWarga() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view statistics");
    };

    wargas.size();
  };

  public query ({ caller }) func getTotalIuranTerkumpul(bulan : Nat, tahun : Nat) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view statistics");
    };

    var total : Nat = 0;
    for (iuran in iurans.values()) {
      if (Nat.compare(iuran.bulan, bulan) == #equal and Nat.compare(iuran.tahun, tahun) == #equal and iuran.statusLunas) {
        total += iuran.jumlah;
      };
    };
    total;
  };

  public query ({ caller }) func getJumlahLunas(bulan : Nat, tahun : Nat) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view statistics");
    };

    var count : Nat = 0;
    for (iuran in iurans.values()) {
      if (Nat.compare(iuran.bulan, bulan) == #equal and Nat.compare(iuran.tahun, tahun) == #equal and iuran.statusLunas) {
        count += 1;
      };
    };
    count;
  };

  public query ({ caller }) func getJumlahBelumLunas(bulan : Nat, tahun : Nat) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view statistics");
    };

    var count : Nat = 0;
    for (iuran in iurans.values()) {
      if (Nat.compare(iuran.bulan, bulan) == #equal and Nat.compare(iuran.tahun, tahun) == #equal and not iuran.statusLunas) {
        count += 1;
      };
    };
    count;
  };
};
