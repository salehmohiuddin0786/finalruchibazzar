const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const DeliveryPartner = sequelize.define(
    "DeliveryPartner",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      // Basic Personal Information
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pincode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      preferredZone: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // Identity & KYC
      aadhaarNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      panNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      voterId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      aadhaarFrontPhoto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      aadhaarBackPhoto: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // Vehicle Details
      vehicleType: {
        type: DataTypes.ENUM("bike", "scooter", "cycle", "walking"),
        defaultValue: "bike",
      },
      vehicleNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      drivingLicenseNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      drivingLicenseExpiry: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      drivingLicensePhoto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vehicleRegistrationNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vehicleInsurance: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pucCertificate: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // Bank Details
      bankAccountNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ifscCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accountHolderName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      upiId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cancelledChequePhoto: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // Other Details
      profilePhoto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      referralCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      educationQualification: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      experience: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emergencyContact: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // Status
      role: {
        type: DataTypes.ENUM("delivery", "partner"),
        defaultValue: "delivery",
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      currentLat: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      currentLng: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 5,
      },
      totalDeliveries: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      kycStatus: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
    },
    {
      tableName: "DeliveryPartners",
      timestamps: true,
    }
  );

  return DeliveryPartner;
};
