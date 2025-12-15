/**
 * Simple audit logging middleware and Mongoose plugin.
 */

const mongoose = require('mongoose');

const AUDIT_ACTIONS = ['create', 'update', 'delete'];

const createAuditModel = () => {
    const auditSchema = new mongoose.Schema({
        collection: { type: String, required: true },
        documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
        action: { type: String, enum: AUDIT_ACTIONS, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        changes: { type: Object },
        createdAt: { type: Date, default: Date.now, index: true }
    }, { versionKey: false });

    return mongoose.models.AuditLog || mongoose.model('AuditLog', auditSchema);
};

const AuditLog = createAuditModel();

const auditPlugin = (schema, options = {}) => {
    const collectionName = options.collection || schema.options.collection;

    schema.post('save', function(doc) {
        const userId = doc._updatedBy || doc._createdBy;
        AuditLog.create({
            collection: collectionName,
            documentId: doc._id,
            action: 'create',
            userId,
            changes: {}
        }).catch(() => {});
    });

    schema.post('findOneAndUpdate', async function(result) {
        if (!result) return;
        const userId = result._updatedBy;
        AuditLog.create({
            collection: collectionName,
            documentId: result._id,
            action: 'update',
            userId,
            changes: {}
        }).catch(() => {});
    });

    schema.post('findOneAndDelete', function(doc) {
        if (!doc) return;
        const userId = doc._updatedBy;
        AuditLog.create({
            collection: collectionName,
            documentId: doc._id,
            action: 'delete',
            userId,
            changes: {}
        }).catch(() => {});
    });
};

module.exports = {
    auditPlugin
};
